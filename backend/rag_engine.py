"""
RAG Engine Module - FREE VERSION (Hugging Face)
No API costs - completely free!
"""

import os
from typing import List, Tuple
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

from models import Citation
from embeddings import EmbeddingGenerator
from vector_store import VectorStore

load_dotenv()


class RAGEngine:
    """FREE Retrieval-Augmented Generation engine using Hugging Face"""
    
    def __init__(self):
        """Initialize FREE RAG engine"""
        # Get Hugging Face token (optional, free!)
        hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
        
        if not hf_token or hf_token == "hf_your_token_here_optional":
            print("⚠️  No Hugging Face token found. Using public inference (may be slower)")
            print("💡 Get a FREE token at: https://huggingface.co/settings/tokens")
            self.client = InferenceClient()
        else:
            print("✅ Using Hugging Face with your token")
            self.client = InferenceClient(token=hf_token)
        
        # Free, high-quality model
        self.model = os.getenv("LLM_MODEL", "mistralai/Mistral-7B-Instruct-v0.2")
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.1"))
        
        self.embedding_generator = EmbeddingGenerator()
        self.vector_store = VectorStore()
        
        self.system_prompt = """You are a precise document Q&A assistant. Your role is to answer questions STRICTLY based on the provided context from uploaded documents.

CRITICAL RULES:
1. Answer ONLY using information from the provided context
2. Include citations for every claim you make
3. Use the format [Document: {document_name}, Section: {chunk_index}] for citations
4. If the answer is not in the context, respond EXACTLY with: "I couldn't find this information in the uploaded document."
5. Never use external knowledge or make assumptions
6. Be concise and accurate
7. If multiple sources support your answer, cite all of them

Remember: Accuracy and grounding are paramount. When in doubt, say you don't know."""
        
        print(f"🆓 FREE RAG engine initialized with model: {self.model}")
    
    def query(self, question: str, top_k: int = 5) -> Tuple[str, List[Citation]]:
        """
        Query the knowledge base and generate answer (FREE!)
        
        Args:
            question: User's question
            top_k: Number of chunks to retrieve
            
        Returns:
            Tuple of (answer, citations)
        """
        # Generate query embedding (free!)
        query_embedding = self.embedding_generator.generate_embedding(question)
        
        # Retrieve relevant chunks
        results = self.vector_store.similarity_search(
            query_embedding=query_embedding,
            top_k=top_k,
            min_score=0.7
        )
        
        if not results:
            return (
                "I couldn't find this information in the uploaded document.",
                []
            )
        
        # Build context from retrieved chunks
        context_parts = []
        citations = []
        
        for idx, result in enumerate(results):
            chunk = result["chunk"]
            score = result["score"]
            
            context_parts.append(
                f"[Source {idx + 1}] Document: {chunk['document_name']}, "
                f"Section: {chunk['chunk_index']}\n{chunk['content']}\n"
            )
            
            # Create citation
            citation = Citation(
                document_name=chunk["document_name"],
                chunk_index=chunk["chunk_index"],
                content_preview=chunk["content"][:200] + "..." if len(chunk["content"]) > 200 else chunk["content"],
                relevance_score=score
            )
            citations.append(citation)
        
        context = "\n\n".join(context_parts)
        
        # Generate answer using free LLM
        answer = self._generate_answer(question, context, citations)
        
        return answer, citations
    
    def _generate_answer(self, question: str, context: str, citations: List[Citation]) -> str:
        """
        Generate answer using FREE Hugging Face LLM
        
        Args:
            question: User's question
            context: Retrieved context
            citations: Citations list
            
        Returns:
            Generated answer
        """
        user_prompt = f"""{self.system_prompt}

Context from documents:
{context}

Question: {question}

Please provide a precise answer based ONLY on the context above. Include citations in the format [Document: name, Section: number]."""
        
        try:
            print("🆓 Generating answer with FREE AI model...")
            # Use free Hugging Face inference
            response = self.client.text_generation(
                user_prompt,
                model=self.model,
                max_new_tokens=500,
                temperature=self.temperature,
                return_full_text=False
            )
            
            answer = response.strip()
            
            # Check if LLM couldn't find answer
            if not answer or "couldn't find" in answer.lower() or "not mentioned" in answer.lower():
                return "I couldn't find this information in the uploaded document."
            
            return answer
            
        except Exception as e:
            print(f"⚠️  Error with Hugging Face API: {e}")
            print("💡 Using fallback: returning relevant context")
            # Fallback: simple extraction from context
            return self._fallback_answer(citations)
    
    def _fallback_answer(self, citations: List[Citation]) -> str:
        """
        Fallback answer if LLM fails
        
        Args:
            citations: Citations list
            
        Returns:
            Simple extracted answer
        """
        # Simple fallback: return first relevant chunk with citation
        if citations:
            first_citation = citations[0]
            return f"Based on the document, here's the relevant information:\n\n{first_citation.content_preview}\n\n[Document: {first_citation.document_name}, Section: {first_citation.chunk_index}]"
        
        return "I couldn't find this information in the uploaded document."

    
    def validate_answer_grounding(self, answer: str, context: str) -> bool:
        """
        Validate that answer is grounded in context
        
        Args:
            answer: Generated answer
            context: Source context
            
        Returns:
            True if answer appears grounded
        """
        # Simple heuristic: check if key phrases from answer appear in context
        # This is a basic implementation; production systems would use more sophisticated methods
        
        if "couldn't find" in answer.lower():
            return True  # Valid response for no information
        
        # Extract key phrases (simple word-based approach)
        answer_words = set(answer.lower().split())
        context_words = set(context.lower().split())
        
        # Check overlap
        overlap = len(answer_words & context_words)
        overlap_ratio = overlap / len(answer_words) if answer_words else 0
        
        # At least 30% of answer words should appear in context
        return overlap_ratio >= 0.3
