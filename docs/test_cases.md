# Test Cases and Expected Answers

## Test Document Setup

For comprehensive testing, use the following sample documents:

### Test Document 1: Company Policy (PDF)
**Filename**: `company_policy.pdf`

**Content Summary**:
- Vacation policy: 15 days paid vacation annually
- Remote work: 2 days per week allowed
- CEO: Sarah Johnson, appointed in 2020
- Office location: 123 Tech Street, San Francisco, CA
- Working hours: 9 AM - 5 PM, Monday to Friday

### Test Document 2: Product Manual (DOCX)
**Filename**: `product_manual.docx`

**Content Summary**:
- Product name: SmartWidget Pro
- Features: AI-powered, cloud-connected, battery life 24 hours
- Price: $299
- Warranty: 2 years
- Support: support@example.com

### Test Document 3: Research Paper (TXT)
**Filename**: `research_paper.txt`

**Content Summary**:
- Topic: Machine Learning in Healthcare
- Authors: Dr. Jane Smith, Dr. Bob Wilson
- Published: 2023
- Key finding: 95% accuracy in disease detection
- Dataset: 10,000 patient records

## Test Cases

### Category 1: Direct Information Retrieval

#### Test Case 1.1: Simple Fact Query
**Question**: "What is the vacation policy?"

**Expected Answer**:
```
Employees receive 15 days of paid vacation annually.
[Document: company_policy.pdf, Section: 2]
```

**Evaluation Criteria**:
- ✅ Correct information extracted
- ✅ Citation included
- ✅ Concise answer
- ✅ No hallucination

---

#### Test Case 1.2: Person Identification
**Question**: "Who is the CEO of the company?"

**Expected Answer**:
```
The CEO is Sarah Johnson, who was appointed in 2020.
[Document: company_policy.pdf, Section: 0]
```

**Evaluation Criteria**:
- ✅ Correct name
- ✅ Additional context (appointment year)
- ✅ Proper citation

---

#### Test Case 1.3: Numerical Information
**Question**: "What is the price of SmartWidget Pro?"

**Expected Answer**:
```
The SmartWidget Pro is priced at $299.
[Document: product_manual.docx, Section: 1]
```

**Evaluation Criteria**:
- ✅ Exact price
- ✅ Product name included
- ✅ Citation present

---

### Category 2: Multi-Chunk Retrieval

#### Test Case 2.1: Feature List
**Question**: "What are the main features of SmartWidget Pro?"

**Expected Answer**:
```
SmartWidget Pro has the following main features:
- AI-powered functionality
- Cloud connectivity
- 24-hour battery life

[Document: product_manual.docx, Section: 1]
[Document: product_manual.docx, Section: 2]
```

**Evaluation Criteria**:
- ✅ Multiple features listed
- ✅ Multiple citations if from different chunks
- ✅ Organized presentation

---

#### Test Case 2.2: Summary Request
**Question**: "Summarize the key findings of the research paper"

**Expected Answer**:
```
The research paper on Machine Learning in Healthcare achieved 95% accuracy in disease detection using a dataset of 10,000 patient records. The study was published in 2023 by Dr. Jane Smith and Dr. Bob Wilson.

[Document: research_paper.txt, Section: 0]
[Document: research_paper.txt, Section: 3]
```

**Evaluation Criteria**:
- ✅ Key information synthesized
- ✅ Multiple facts combined
- ✅ All citations included

---

### Category 3: Not Found Scenarios

#### Test Case 3.1: Information Not in Document
**Question**: "What is the company's stock price?"

**Expected Answer**:
```
I couldn't find this information in the uploaded document.
```

**Evaluation Criteria**:
- ✅ Explicit statement of not finding information
- ✅ No hallucination or guessing
- ✅ No citations (since no relevant content)

---

#### Test Case 3.2: Unrelated Query
**Question**: "What is the weather today?"

**Expected Answer**:
```
I couldn't find this information in the uploaded document.
```

**Evaluation Criteria**:
- ✅ Correct response for out-of-scope query
- ✅ No attempt to answer from external knowledge

---

### Category 4: Complex Reasoning

#### Test Case 4.1: Comparison
**Question**: "How many days per week can employees work remotely?"

**Expected Answer**:
```
Employees are allowed to work remotely 2 days per week.
[Document: company_policy.pdf, Section: 2]
```

**Evaluation Criteria**:
- ✅ Specific number extracted
- ✅ Context provided
- ✅ Citation included

---

#### Test Case 4.2: Contact Information
**Question**: "How can I contact support for SmartWidget Pro?"

**Expected Answer**:
```
You can contact support for SmartWidget Pro at support@example.com.
[Document: product_manual.docx, Section: 4]
```

**Evaluation Criteria**:
- ✅ Correct email address
- ✅ Product name included for context
- ✅ Citation present

---

### Category 5: Edge Cases

#### Test Case 5.1: Ambiguous Query
**Question**: "Tell me about the authors"

**Expected Answer**:
```
The research paper was authored by Dr. Jane Smith and Dr. Bob Wilson.
[Document: research_paper.txt, Section: 0]
```

**Evaluation Criteria**:
- ✅ Correctly identifies which document has authors
- ✅ Lists all authors
- ✅ Proper citation

---

#### Test Case 5.2: Multiple Documents
**Question**: "What documents have been uploaded?"

**Expected Answer**:
```
Based on the available information, I can see references to company policies, product information, and research content. However, I can only answer questions about the specific content within these documents.
[Multiple sources]
```

**Evaluation Criteria**:
- ✅ Acknowledges multiple documents
- ✅ Stays within scope
- ✅ Helpful response

---

## Evaluation Rubric

### Accuracy & Grounding (40%)

| Criteria | Weight | Evaluation |
|----------|--------|------------|
| Information is factually correct | 15% | All facts match source documents |
| No hallucinations | 15% | Zero instances of made-up information |
| Answers only from documents | 10% | No external knowledge used |

### Citation Quality (20%)

| Criteria | Weight | Evaluation |
|----------|--------|------------|
| Citations present for all claims | 10% | Every factual statement cited |
| Citations are accurate | 5% | Document name and section correct |
| Citations are helpful | 5% | User can verify information |

### User Experience (20%)

| Criteria | Weight | Evaluation |
|----------|--------|------------|
| Response time < 3 seconds | 7% | Fast query processing |
| Clear, concise answers | 7% | Well-formatted responses |
| Helpful for "not found" cases | 6% | Appropriate messaging |

### Code Quality (20%)

| Criteria | Weight | Evaluation |
|----------|--------|------------|
| Clean, modular code | 7% | Well-organized structure |
| Proper error handling | 7% | Graceful failure modes |
| Documentation | 6% | Clear comments and README |

## Testing Checklist

### Functional Testing
- [ ] Upload PDF successfully
- [ ] Upload DOCX successfully
- [ ] Upload TXT successfully
- [ ] Upload MD successfully
- [ ] Reject unsupported file types
- [ ] Reject files over size limit
- [ ] Process documents in background
- [ ] Generate embeddings correctly
- [ ] Store chunks in database
- [ ] Retrieve relevant chunks
- [ ] Generate accurate answers
- [ ] Include proper citations
- [ ] Handle "not found" cases
- [ ] Delete documents
- [ ] Reset knowledge base
- [ ] Clear chat history

### Performance Testing
- [ ] Upload 1MB file < 5 seconds
- [ ] Upload 5MB file < 15 seconds
- [ ] Query response < 3 seconds
- [ ] Handle 10+ documents
- [ ] Handle 100+ chunks
- [ ] Concurrent queries

### Edge Case Testing
- [ ] Empty file upload
- [ ] Corrupted file upload
- [ ] Very large file (>10MB)
- [ ] Empty query
- [ ] Very long query (>1000 chars)
- [ ] Special characters in query
- [ ] Multiple rapid queries
- [ ] Query before upload
- [ ] Network timeout handling

### UI/UX Testing
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Drag-and-drop works
- [ ] Progress indicators show
- [ ] Error messages clear
- [ ] Citations clickable
- [ ] Citation modal displays
- [ ] Smooth animations
- [ ] Accessible (keyboard navigation)

## Sample Test Script

```python
# test_rag_system.py

import requests
import time

API_URL = "http://localhost:8000"

def test_upload_document():
    """Test document upload"""
    with open("test_documents/company_policy.pdf", "rb") as f:
        files = {"file": f}
        response = requests.post(f"{API_URL}/api/upload", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    return data["document_id"]

def test_query(question, expected_keywords):
    """Test query with expected keywords"""
    payload = {
        "question": question,
        "top_k": 5
    }
    response = requests.post(f"{API_URL}/api/query", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    # Check answer contains expected keywords
    answer = data["answer"].lower()
    for keyword in expected_keywords:
        assert keyword.lower() in answer, f"Expected '{keyword}' in answer"
    
    # Check citations present
    assert len(data["citations"]) > 0, "Expected citations"
    
    print(f"✅ Query passed: {question}")
    print(f"   Answer: {data['answer'][:100]}...")
    print(f"   Citations: {len(data['citations'])}")

def test_not_found():
    """Test query for information not in document"""
    payload = {
        "question": "What is the stock price?",
        "top_k": 5
    }
    response = requests.post(f"{API_URL}/api/query", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    # Should indicate information not found
    assert "couldn't find" in data["answer"].lower()
    print("✅ Not found case handled correctly")

if __name__ == "__main__":
    print("Starting RAG System Tests...")
    
    # Test upload
    doc_id = test_upload_document()
    print(f"✅ Document uploaded: {doc_id}")
    
    # Wait for processing
    time.sleep(5)
    
    # Test queries
    test_query("What is the vacation policy?", ["15 days", "vacation"])
    test_query("Who is the CEO?", ["Sarah Johnson", "CEO"])
    test_query("What is the remote work policy?", ["2 days", "remote"])
    
    # Test not found
    test_not_found()
    
    print("\n✅ All tests passed!")
```

## Success Criteria

The system passes if:
1. ✅ 90%+ accuracy on direct fact retrieval
2. ✅ 100% citation coverage (every answer has citations)
3. ✅ 0% hallucination rate
4. ✅ <3 second average response time
5. ✅ Proper handling of "not found" cases
6. ✅ All file formats supported
7. ✅ Clean, documented code
8. ✅ Comprehensive README
