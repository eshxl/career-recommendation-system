# Career Path Recommendation System for Engineering Students

**Intelligent Decision-Making System using Knowledge Engineering** 

---

## 🎯 Project Overview

This project implements an **Intelligent Career Path Recommendation System** that applies the complete Knowledge Engineering lifecycle to help engineering students make informed career decisions.

### Key Features:
- ✅ **FOL-based Knowledge Representation** (First-Order Logic)
- ✅ **Rule-Based Expert System** with 10+ career path rules
- ✅ **Forward Chaining Inference Engine**
- ✅ **Confidence-Based Scoring** (Certainty Factors)
- ✅ **Explainable AI** (Complete reasoning trace)
- ✅ **Real Dataset** (roo_data.csv - 20,000+ student records)

---

## 📊 Dataset

**Source:** Om Baval's Career Prediction Model Dataset  
**Repository:** https://github.com/OmBaval/Career-Prediction-Model  
**File:** `roo_data.csv`  
**Size:** 20,000 entries, 38 features  
**License:** MIT License  

### Dataset Features:
- Academic Performance (CGPA, Projects, Publications)
- Skills (Coding, Analytical, Communication, Problem-Solving)
- Interests (Coding, Research, Management, Hands-on)
- Personality Traits (Risk Appetite, Leadership, Patience)
- Constraints (Financial, Family Pressure, Location)

**Citation:**
```
Om Baval (2024). Career Prediction Model Dataset (roo_data.csv). 
GitHub: https://github.com/OmBaval/Career-Prediction-Model
License: MIT. Accessed: March 2026.
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
│  (Input Collection → Results Display → Explanation Viewer)  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  INFERENCE ENGINE LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Pattern    │→ │   Conflict   │→ │   Confidence    │  │
│  │   Matcher    │  │  Resolution  │  │   Calculator    │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│              Forward Chaining Algorithm                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   KNOWLEDGE BASE LAYER                       │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │   Rule Base      │  │     Fact Base                │    │
│  │  (Career Rules)  │  │  (Student Profile + Career   │    │
│  │  - 10 Rules      │  │   Characteristics)           │    │
│  │  - FOL Format    │  │                              │    │
│  └──────────────────┘  └──────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXPLANATION FACILITY                        │
│  • Reasoning Trace  • Rule Justification  • What-If         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
career-recommendation-system/
│
├── knowledgeBase.js          # FOL Rules + Career Path Definitions
├── inferenceEngine.js        # Forward Chaining Engine
├── main.js                   # Application Entry Point
├── testCases.js             # Validation Test Suite
│
├── dataset/
│   └── roo_data.csv         # Student career dataset
│
├── docs/
│   ├── FOL_Representation.md   # First-Order Logic Documentation
│   ├── Phase1_Problem_Definition.pdf
│   ├── Phase2_Knowledge_Identification.pdf
│   └── ... (All phase documents)
│
├── output/
│   └── career_recommendation_report.json
│
├── README.md                # This file
└── package.json            # Node.js dependencies
```

---

## 🚀 Installation & Setup

### Prerequisites:
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OmBaval/Career-Prediction-Model.git
   cd career-recommendation-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the system:**
   ```bash
   node main.js
   ```

4. **Run tests:**
   ```bash
   node testCases.js
   ```

---

## 💡 Knowledge Representation (FOL)

### Sample FOL Rules:

**Rule 1: Software Development Path**
```
∀X [ hasHighCGPA(X) ∧ 
     hasHighCodingSkills(X) ∧ 
     hasHighProblemSolving(X) ∧ 
     interestedInCoding(X) ∧
     hasProjects(X, 3)
     → suitableFor(X, SoftwareDev) ∧ highConfidence(X, SoftwareDev) ]
```

**Rule 2: Higher Studies Path**
```
∀X [ hasExcellentCGPA(X) ∧ 
     interestedInResearch(X) ∧ 
     canAffordHigherStudies(X) ∧
     hasHighPatience(X)
     → suitableFor(X, HigherStudies) ]
```

See `docs/FOL_Representation.md` for complete formal representation.

---

## ⚙️ Inference Engine Algorithm

### Forward Chaining Process:

```
1. LOAD FACTS
   └─ Student profile → Working Memory

2. MATCH PHASE
   ├─ Evaluate each career rule's conditions
   ├─ Check if facts satisfy predicates
   └─ Collect matching career paths

3. APPLY CONSTRAINTS
   ├─ Financial constraints → penalize expensive paths
   ├─ Family pressure → prioritize immediate jobs
   └─ Update confidence scores

4. APPLY BOOSTS
   ├─ Publications → boost research paths
   ├─ Multiple internships → boost industry roles
   └─ Certifications → boost technical paths

5. CONFLICT RESOLUTION
   ├─ Rank by confidence score
   ├─ Emergency priority first
   └─ Select top 3 recommendations

6. GENERATE EXPLANATIONS
   └─ Create reasoning trace for each recommendation
```

---

## 📊 Test Results

### Validation Summary:

| Test Case | Student Profile | Expected Path | System Recommendation | Status |
|-----------|----------------|---------------|----------------------|---------|
| TC_001 | High CGPA + Research Interest | Higher Studies | Higher Studies (MS/PhD) 92% | ✅ PASS |
| TC_002 | Strong Coder | Software Development | Software Dev (Product) 90% | ✅ PASS |
| TC_003 | Mechanical + Practical Skills | Core Engineering | Core Engineering 80% | ✅ PASS |
| TC_004 | High Analytical Skills | Data Science | Data Science 88% | ✅ PASS |
| TC_005 | High Risk + Leadership | Entrepreneurship | Entrepreneurship 75% | ✅ PASS |
| TC_006 | Work-Life Balance Focus | Government Jobs | Government Jobs 85% | ✅ PASS |

**Success Rate:** 100% (6/6 tests passed)  
**Average Execution Time:** 12-18ms per recommendation

---

## 🔍 Sample Output

```
🎯 TOP CAREER PATH RECOMMENDATIONS:

1. HIGHER STUDIES (MS/MTECH/PHD)
   Confidence Score: 95.0% (Base: 92.0%)
   Category: Academic | Priority: High

   💡 Why This Path:
   Excellent academic record with research aptitude. Strong foundation 
   for graduate studies. MS/PhD opens doors to research roles, academia, 
   and specialized technical positions.

   ✓ Key Matching Factors:
      • Excellent CGPA (8.7) meets high academic standards
      • Strong coding skills (9/10)
      • High analytical ability (8/10)

   + Supporting Factors:
      • High interest in coding/programming
      • Strong research interest
      • Completed 5 projects
      • 2 internship experiences
      • 1 publication(s)

   ↑ Confidence Boosters:
      • Research Publication Boost (+8.0%)

   📍 Next Steps:
      1. Prepare for GRE/GATE (depending on country preference)
      2. Identify target universities and research labs
      3. Work on research publications or thesis
      4. Connect with professors for recommendation letters

   💰 Expected Salary: Varies (Stipend during studies, 12-25 LPA post-MS)
   ⚖️  Work-Life Balance: Low | Job Security: Medium
```

---

## 📖 Knowledge Engineering Phases Completed

### ✅ Phase 0: Domain and Title
- Domain: Education – Career Guidance
- Title: Career Path Recommender for Engineering Students

### ✅ Phase 1: Problem Definition
- Clear decision scope defined
- Target users identified
- Input/output specifications documented

### ✅ Phase 2: Knowledge Identification
- Facts: Student attributes, career characteristics
- Rules: 10+ career recommendation rules
- Constraints: Financial, family pressure, eligibility
- Relationships: Skill-career mappings defined

### ✅ Phase 3: Knowledge Acquisition
- Dataset: roo_data.csv (20,000 entries)
- Expert interviews simulated through dataset patterns
- Documented sources and methods

### ✅ Phase 4: Knowledge Structuring
- Decision tables created
- Rule lists formalized
- Concept-relationship model designed

### ✅ Phase 5: Knowledge Representation
- **First-Order Logic (FOL)** format
- Predicates, quantifiers, logical connectives
- Formal rule representation

### ✅ Phase 6: Reasoning Mechanism
- **Forward Chaining** algorithm
- Data-driven approach (facts → conclusions)
- Confidence-based scoring

### ✅ Phase 7: Inference Engine Logic
- Pattern matching implemented
- Conflict resolution via confidence ranking
- Rule firing mechanism documented

### ✅ Phase 8: System Architecture
- 4-layer architecture designed
- Component interactions defined
- Data flow documented

### ✅ Phase 9: Validation and Testing
- 6 comprehensive test cases
- Normal, boundary, and edge cases
- 100% test pass rate

### ✅ Phase 10: Explanation Facility
- Complete reasoning trace
- Justification for each recommendation
- WHY and WHY-NOT explanations

### ✅ Phase 11: Limitations and Future Work
- Current limitations identified
- Missing knowledge acknowledged
- Enhancement roadmap created

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **Knowledge Acquisition** from real-world datasets
2. **Formal Knowledge Representation** using FOL
3. **Rule-Based Reasoning** with forward chaining
4. **Confidence Factors** for uncertainty handling
5. **Explainable AI** through reasoning traces
6. **System Validation** with comprehensive testing
7. **Engineering Thinking** (not just coding)

---

## ⚠️ Current Limitations

1. **Static Knowledge Base** – Rules don't adapt automatically
2. **Binary Logic** – Uses crisp thresholds instead of fuzzy boundaries
3. **Limited Domains** – Focuses on common career paths only
4. **Self-Reported Data** – Relies on student's self-assessment
5. **No Learning** – Doesn't improve from feedback over time

---

## 🚀 Future Enhancements

### Short-term (Phase 2):
- Fuzzy logic integration for uncertainty
- Web-based UI with interactive visualizations
- Integration with real university placement data

### Long-term (Phase 3):
- Machine learning for pattern discovery
- Natural language interface
- Multi-agent collaborative reasoning
- Real-time job market data integration

---

## 📝 References

1. **Dataset:**  
   Om Baval (2024). Career Prediction Model Dataset. GitHub Repository.  
   https://github.com/OmBaval/Career-Prediction-Model

2. **Knowledge Engineering:**  
   Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.).

3. **Expert Systems:**  
   Jackson, P. (1998). Introduction to Expert Systems (3rd ed.).

4. **First-Order Logic:**  
   Nilsson, N. J. (1998). Artificial Intelligence: A New Synthesis.

---

## 👨‍💻 Author

**Eshal Shanoj**  

---

## 📄 License

This academic project is for educational purposes only.  
Dataset used under MIT License (Om Baval, 2024).

---

**Last Updated:** March 30, 2026  
**Version:** 1.0.0
