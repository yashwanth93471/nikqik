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
        Generate answer using FREE Hugging Face LLM with retry logic
        
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
        
        # Try Hugging Face API with retry logic
        max_retries = 2
        for attempt in range(max_retries):
            try:
                print(f"🆓 Generating answer with FREE AI model (attempt {attempt + 1}/{max_retries})...")
                
                # Use free Hugging Face inference
                response = self.client.text_generation(
                    user_prompt,
                    model=self.model,
                    max_new_tokens=500,
                    temperature=self.temperature,
                    return_full_text=False
                )
                
                answer = response.strip()
                
                # Check if we got a valid answer
                if answer and len(answer) > 20:
                    print("✅ Successfully generated answer with AI")
                    return answer
                
            except Exception as e:
                print(f"⚠️  Attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    import time
                    time.sleep(1)  # Brief pause before retry
                continue
        
        # If all retries failed, use intelligent fallback
        print("💡 Using intelligent fallback: extractive summarization")
        return self._intelligent_fallback(question, citations)
    
    def _intelligent_fallback(self, question: str, citations: List[Citation]) -> str:
        """
        Intelligent fallback that extracts relevant information from citations
        
        Args:
            question: User's question
            citations: Retrieved citations
            
        Returns:
            Extracted answer with citations
        """
        if not citations:
            return "I couldn't find this information in the uploaded documents."
        
        # Extract question keywords
        question_lower = question.lower()
        question_words = set(word.strip('?.,!') for word in question_lower.split() 
                           if len(word) > 3 and word not in ['what', 'when', 'where', 'which', 'who', 'how', 'does', 'this', 'that', 'the'])
        
        # Score sentences from each citation
        relevant_sentences = []
        
        for citation in citations[:3]:  # Use top 3 citations
            content = citation.content_preview
            sentences = content.split('. ')
            
            for sentence in sentences:
                if len(sentence.strip()) < 20:
                    continue
                
                sentence_lower = sentence.lower()
                # Calculate relevance score
                matches = sum(1 for word in question_words if word in sentence_lower)
                
                if matches > 0:
                    relevant_sentences.append({
                        'text': sentence.strip(),
                        'score': matches,
                        'citation': citation
                    })
        
        # Sort by relevance
        relevant_sentences.sort(key=lambda x: x['score'], reverse=True)
        
        if not relevant_sentences:
            # No specific matches, return overview from top citation
            top_citation = citations[0]
            return f"""Based on the uploaded document, here's the relevant information:

{top_citation.content_preview}

[Source: {top_citation.document_name}, Section {top_citation.chunk_index}]"""
        
        # Build answer from top relevant sentences
        answer_parts = []
        used_citations = set()
        
        for item in relevant_sentences[:3]:  # Top 3 most relevant sentences
            answer_parts.append(item['text'])
            used_citations.add((item['citation'].document_name, item['citation'].chunk_index))
        
        answer = '. '.join(answer_parts)
        if not answer.endswith('.'):
            answer += '.'
        
        # Add citations
        citation_text = '\n\n' + '\n'.join([
            f"[Source: {doc}, Section {idx}]" 
            for doc, idx in sorted(used_citations)
        ])
        
        return answer + citation_text
    
    def _fallback_answer(self, citations: List[Citation]) -> str:
        """
        Legacy fallback - now redirects to intelligent fallback
        
        Args:
            citations: Citations list
            
        Returns:
            Extracted answer
        """
        return self._intelligent_fallback("", citations)
    
    def summarize_document(self, document_id: str) -> str:
        """
        Generate a summary of a document
        
        Args:
            document_id: Document ID to summarize
            
        Returns:
            Document summary
        """
        # Get all chunks for this document
        all_chunks = self.vector_store.get_document_chunks(document_id)
        
        if not all_chunks:
            return "Document not found or has no content."
        
        # Get document name
        doc_name = all_chunks[0].get('document_name', 'Unknown')
        total_chunks = len(all_chunks)
        
        # Take first few chunks for summary (beginning of document)
        summary_chunks = all_chunks[:min(3, total_chunks)]
        
        # Combine content
        combined_content = '\n\n'.join([chunk['content'][:500] for chunk in summary_chunks])
        
        # Try to generate AI summary
        summary_prompt = f"""Provide a concise summary (3-4 sentences) of this document based on the following excerpt:

{combined_content}

Summary:"""
        
        try:
            response = self.client.text_generation(
                summary_prompt,
                model=self.model,
                max_new_tokens=200,
                temperature=0.3,
                return_full_text=False
            )
            
            summary = response.strip()
            if summary and len(summary) > 20:
                return f"**{doc_name}**\n\n{summary}\n\n*Document contains {total_chunks} sections*"
        
        except Exception as e:
            print(f"⚠️  AI summary failed: {e}")
        
        # Fallback: extractive summary
        first_chunk = all_chunks[0]['content']
        preview = first_chunk[:400] + "..." if len(first_chunk) > 400 else first_chunk
        
        return f"""**{doc_name}**

{preview}

*This document contains {total_chunks} sections. Upload complete.*"""

    
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
