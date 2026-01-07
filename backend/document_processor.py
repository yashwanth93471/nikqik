"""
Document Processor Module
Handles extraction and chunking of various document formats
"""

import os
import re
from typing import List, Tuple
from pathlib import Path
import tiktoken

# Document parsing libraries
import PyPDF2
from docx import Document as DocxDocument
import markdown


class DocumentProcessor:
    """Process documents and chunk them for RAG"""
    
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 200):
        """
        Initialize document processor
        
        Args:
            chunk_size: Target size of each chunk in tokens
            chunk_overlap: Number of overlapping tokens between chunks
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoding = tiktoken.get_encoding("cl100k_base")  # GPT-4 encoding
    
    def extract_text(self, file_path: str, file_type: str) -> str:
        """
        Extract text from document based on file type
        
        Args:
            file_path: Path to the document
            file_type: Type of document (pdf, docx, txt, md)
            
        Returns:
            Extracted text content
        """
        if file_type == "pdf":
            return self._extract_pdf(file_path)
        elif file_type == "docx":
            return self._extract_docx(file_path)
        elif file_type == "txt":
            return self._extract_txt(file_path)
        elif file_type == "md":
            return self._extract_markdown(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def _extract_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        text = []
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text.strip():
                    text.append(f"[Page {page_num + 1}]\n{page_text}")
        return "\n\n".join(text)
    
    def _extract_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        doc = DocxDocument(file_path)
        paragraphs = []
        for para in doc.paragraphs:
            if para.text.strip():
                paragraphs.append(para.text)
        return "\n\n".join(paragraphs)
    
    def _extract_txt(self, file_path: str) -> str:
        """Extract text from TXT"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    def _extract_markdown(self, file_path: str) -> str:
        """Extract text from Markdown (convert to plain text)"""
        with open(file_path, 'r', encoding='utf-8') as file:
            md_content = file.read()
        # Convert markdown to HTML then strip tags for plain text
        html = markdown.markdown(md_content)
        # Simple HTML tag removal
        text = re.sub(r'<[^>]+>', '', html)
        return text
    
    def chunk_text(self, text: str, document_name: str) -> List[Tuple[str, dict]]:
        """
        Chunk text into overlapping segments
        
        Args:
            text: Full text to chunk
            document_name: Name of the source document
            
        Returns:
            List of (chunk_text, metadata) tuples
        """
        # Tokenize the text
        tokens = self.encoding.encode(text)
        
        chunks = []
        start_idx = 0
        chunk_index = 0
        
        while start_idx < len(tokens):
            # Get chunk tokens
            end_idx = min(start_idx + self.chunk_size, len(tokens))
            chunk_tokens = tokens[start_idx:end_idx]
            
            # Decode back to text
            chunk_text = self.encoding.decode(chunk_tokens)
            
            # Try to break at sentence boundaries for cleaner chunks
            if end_idx < len(tokens):
                chunk_text = self._break_at_sentence(chunk_text)
            
            # Create metadata
            metadata = {
                "document_name": document_name,
                "chunk_index": chunk_index,
                "start_token": start_idx,
                "end_token": end_idx,
                "token_count": len(chunk_tokens)
            }
            
            chunks.append((chunk_text.strip(), metadata))
            
            # Move to next chunk with overlap
            start_idx += self.chunk_size - self.chunk_overlap
            chunk_index += 1
        
        # Add total chunks to metadata
        for _, meta in chunks:
            meta["total_chunks"] = len(chunks)
        
        return chunks
    
    def _break_at_sentence(self, text: str) -> str:
        """
        Try to break text at sentence boundary
        
        Args:
            text: Text to break
            
        Returns:
            Text broken at sentence boundary if possible
        """
        # Look for sentence endings in the last 20% of text
        search_start = int(len(text) * 0.8)
        search_text = text[search_start:]
        
        # Find last sentence ending
        sentence_endings = ['. ', '! ', '? ', '.\n', '!\n', '?\n']
        last_ending = -1
        
        for ending in sentence_endings:
            pos = search_text.rfind(ending)
            if pos > last_ending:
                last_ending = pos
        
        if last_ending != -1:
            # Break at sentence ending
            return text[:search_start + last_ending + 1]
        
        return text
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        return len(self.encoding.encode(text))
    
    def process_document(self, file_path: str, file_type: str, document_name: str) -> List[Tuple[str, dict]]:
        """
        Complete document processing pipeline
        
        Args:
            file_path: Path to document
            file_type: Type of document
            document_name: Name of document
            
        Returns:
            List of (chunk_text, metadata) tuples
        """
        # Extract text
        text = self.extract_text(file_path, file_type)
        
        # Chunk text
        chunks = self.chunk_text(text, document_name)
        
        return chunks


# Utility function for validation
def validate_file_type(filename: str) -> str:
    """
    Validate and extract file type from filename
    
    Args:
        filename: Name of the file
        
    Returns:
        File extension (pdf, docx, txt, md)
        
    Raises:
        ValueError: If file type is not supported
    """
    ext = Path(filename).suffix.lower().lstrip('.')
    
    supported_types = ['pdf', 'docx', 'txt', 'md']
    
    if ext not in supported_types:
        raise ValueError(
            f"Unsupported file type: {ext}. "
            f"Supported types: {', '.join(supported_types)}"
        )
    
    return ext
