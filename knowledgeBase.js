/**
 * KNOWLEDGE BASE — Career Path Recommendation System
 * Based on: roo_data.csv dataset (Om Baval, 2024)
 * Representation: Rule-Based System with FOL foundations
 * 
 * Structure:
 *   - Career Path Condition Rules (FOL predicates → recommendations)
 *   - Constraint Rules (filtering based on limitations)
 *   - Priority Adjustment Rules (boost/penalize based on factors)
 */

const knowledgeBase = {

  // ═══════════════════════════════════════════════════════════
  // CAREER PATH RECOMMENDATION RULES
  // ═══════════════════════════════════════════════════════════

  careerRules: [
    
    // ─── RULE 1: SOFTWARE DEVELOPMENT (Product Companies) ────────
    {
      id: "CAREER_R001",
      name: "Software Development - Product Companies",
      category: "Technical",
      priority: "High",
      
      // FOL: ∀X [ hasHighCGPA(X) ∧ hasHighCodingSkills(X) ∧ 
      //           hasHighProblemSolving(X) ∧ interestedInCoding(X) ∧
      //           hasProjects(X, 3) → suitableFor(X, SoftwareDev) ]
      
      conditions: (student) =>
        student.cgpa >= 7.5 &&
        student.skills.coding_skills >= 7 &&
        student.skills.problem_solving >= 8 &&
        student.interests.coding === "high" &&
        student.academic_achievements.projects_completed >= 3 &&
        // Prefer CS/IT branches
        (["Computer Science", "Information Technology"].includes(student.profile.branch) || 
        student.skills.coding_skills >= 8),  // Non-CS students need higher coding skills
            
        rationale: "Strong technical foundation with proven coding ability and project experience. " +
        "Meets requirements for product-based software companies.",

      cf: 0.90,
      
      actionSteps: [
        "Practice Data Structures & Algorithms on LeetCode/HackerRank",
        "Build 2-3 showcase projects for GitHub portfolio",
        "Apply to product companies: Google, Microsoft, Amazon, etc.",
        "Prepare for technical interviews (system design, coding rounds)"
      ],
      
      expectedSalary: "High (8-20 LPA for freshers in product companies)",
      workLifeBalance: "Medium",
      jobSecurity: "High"
    },

    // ─── RULE 2: SOFTWARE DEVELOPMENT (Service Companies) ────────
    {
      id: "CAREER_R002",
      name: "Software Development - Service Companies",
      category: "Technical",
      priority: "Medium",
      
      // FOL: ∀X [ hasMediumCGPA(X) ∧ (hasMediumCodingSkills(X) ∨ hasHighCodingSkills(X)) ∧
      //           interestedInCoding(X) → suitableFor(X, SoftwareDev_Service) ]
      conditions: (student) =>
        student.cgpa >= 6.5 &&
        student.skills.coding_skills >= 5 &&
        (student.interests.coding === "high" || student.interests.coding === "medium"),
      
      cf: 0.82,
      
      rationale: "Meets baseline technical requirements. Service companies have moderate entry barriers " +
                 "and provide good learning opportunities for career growth.",
      
      actionSteps: [
        "Learn core programming: Java/Python/JavaScript",
        "Complete online certifications (AWS, Azure basics)",
        "Apply to: TCS, Infosys, Wipro, Cognizant, Accenture",
        "Focus on communication skills for client interaction"
      ],
      
      expectedSalary: "Medium (3.5-6 LPA for freshers)",
      workLifeBalance: "Medium",
      jobSecurity: "High"
    },

    // ─── RULE 3: HIGHER STUDIES (MS/PhD) ──────────────────────
    {
      id: "CAREER_R003",
      name: "Higher Studies (MS/MTech/PhD)",
      category: "Academic",
      priority: "High",
      
      // FOL: ∀X [ hasExcellentCGPA(X) ∧ interestedInResearch(X) ∧ 
      //           hasHighAnalyticalSkills(X) ∧ canAffordHigherStudies(X) ∧
      //           hasHighPatience(X) → suitableFor(X, HigherStudies) ]
      conditions: (student) =>
        student.cgpa >= 8.0 &&
        student.interests.research === "high" &&
        student.skills.analytical_skills >= 7 &&
        (student.constraints.financial_constraint === "low" ||
         student.constraints.financial_constraint === "medium") &&
        student.personality.patience_level === "high",
      
      cf: 0.92,
      
      // Boost if publications exist
      boost: (student) => student.academic_achievements.publications > 0 ? 0.05 : 0,
      
      rationale: "Excellent academic record with research aptitude. Strong foundation for graduate studies. " +
                 "MS/PhD opens doors to research roles, academia, and specialized technical positions.",
      
      actionSteps: [
        "Prepare for GRE/GATE (depending on country preference)",
        "Identify target universities and research labs",
        "Work on research publications or thesis",
        "Connect with professors for recommendation letters",
        "Apply for scholarships and assistantships"
      ],
      
      expectedSalary: "Varies (Stipend during studies, 12-25 LPA post-MS in industry)",
      workLifeBalance: "Low (during studies), High (post-PhD in academia)",
      jobSecurity: "Medium (depends on specialization)"
    },

    // ─── RULE 4: DATA SCIENCE & ANALYTICS ─────────────────────
    {
      id: "CAREER_R004",
      name: "Data Science & Analytics",
      category: "Technical",
      priority: "High",
      
      // FOL: ∀X [ (hasHighCGPA(X) ∨ hasMediumCGPA(X)) ∧ 
      //           hasHighCodingSkills(X) ∧ hasHighAnalyticalSkills(X) ∧
      //           hasTechnicalExpertise(X) → suitableFor(X, DataScience) ]
      conditions: (student) =>
        student.cgpa >= 7.0 &&
        student.skills.coding_skills >= 7 &&
        student.skills.analytical_skills >= 8 &&
        student.skills.problem_solving >= 7 &&
        student.academic_achievements.projects_completed >= 2 &&
        (student.interests.coding === "high" || student.interests.research === "high" || 
        student.interests.coding === "medium"),
        cf: 0.88,
      
      // Bonus for data-related certifications
      boost: (student) => {
        const dataCerts = ["Data Science", "Machine Learning", "AI", "Statistics", "Python", "SQL"];
        const hasCert = student.academic_achievements.certifications?.some(cert =>
          dataCerts.some(dc => cert.includes(dc))
        );
        return hasCert ? 0.05 : 0;
      },
      
      rationale: "Strong analytical and coding skills align with data science requirements. " +
                 "High market demand for data professionals across industries.",
      
      actionSteps: [
        "Learn Python, R, SQL for data analysis",
        "Master ML libraries: Pandas, NumPy, Scikit-learn, TensorFlow",
        "Build portfolio: Kaggle competitions, data projects on GitHub",
        "Get certified: Google Data Analytics, IBM Data Science",
        "Apply to: Analytics firms, tech companies, startups"
      ],
      
      expectedSalary: "High (6-15 LPA for freshers with strong skills)",
      workLifeBalance: "Medium",
      jobSecurity: "High"
    },

    // ─── RULE 5: ENTREPRENEURSHIP ─────────────────────────────
    {
      id: "CAREER_R005",
      name: "Entrepreneurship / Startup Founder",
      category: "Business",
      priority: "Medium",
      
      // FOL: ∀X [ hasHighRiskAppetite(X) ∧ hasHighLeadership(X) ∧ 
      //           innovation_ability(X) ≥ 7 ∧ (hasHighCodingSkills(X) ∨ hasHighPracticalSkills(X)) ∧
      //           hasHighCommunication(X) → suitableFor(X, Entrepreneurship) ]
      conditions: (student) =>
        student.personality.risk_appetite === "high" &&
        student.personality.leadership >= 8 &&
        (student.skills.coding_skills >= 6 || student.skills.practical_skills >= 7) &&
        student.skills.communication_skills >= 7 &&
        (student.interests.management === "high" || student.interests.management === "medium"),
      
      cf: 0.80,
      
      rationale: "Entrepreneurial mindset with leadership qualities and domain expertise. " +
                 "Willingness to take risks and ability to execute ideas.",
      
      actionSteps: [
        "Identify a problem/opportunity in a domain you understand",
        "Validate idea through customer interviews and MVP",
        "Join startup incubators (T-Hub, NSRCEL, Y Combinator)",
        "Build a co-founding team with complementary skills",
        "Learn basics of fundraising, product management, and marketing"
      ],
      
      expectedSalary: "Varies (High risk, potentially high reward)",
      workLifeBalance: "Very Low (especially in early stages)",
      jobSecurity: "Low"
    },

    // ─── RULE 6: GOVERNMENT JOBS (GATE/PSU/Civil Services) ────
    {
      id: "CAREER_R006",
      name: "Government Jobs (GATE/PSU/Civil Services)",
      category: "Public Sector",
      priority: "Medium",
      
      // FOL: ∀X [ (hasHighCGPA(X) ∨ hasMediumCGPA(X)) ∧ 
      //           prefersWorkLifeBalance(X) ∧ prefersJobSecurity(X) ∧
      //           hasHighPatience(X) ∧ hasLowRiskAppetite(X)
      //           → suitableFor(X, GovernmentJobs) ]
      conditions: (student) =>
        student.cgpa >= 6.5 &&
        student.personality.work_life_balance_priority === "high" &&
        student.personality.patience_level === "high" &&
        student.personality.risk_appetite === "low",
      
      cf: 0.85,
      
      rationale: "Preference for job security and work-life balance aligns with government sector benefits. " +
                 "Stable career with pension and social prestige.",
      
      actionSteps: [
        "Prepare for GATE/ESE (Engineering Services Exam)",
        "Join coaching institutes or online prep platforms",
        "Focus on core engineering subjects + aptitude",
        "Target PSUs: ONGC, NTPC, BHEL, SAIL, etc.",
        "Consider UPSC CSE if interested in administrative roles"
      ],
      
      expectedSalary: "Medium (5-10 LPA in PSUs, Grade Pay scale in Civil Services)",
      workLifeBalance: "High",
      jobSecurity: "Very High"
    },

    // ─── RULE 7: CORE ENGINEERING ROLES ───────────────────────
    {
      id: "CAREER_R007",
      name: "Core Engineering (Industry Roles)",
      category: "Technical",
      priority: "Medium",
      
      // FOL: ∀X [ isCoreEngineeringStudent(X) ∧ hasHighPracticalSkills(X) ∧ 
      //           interestedInHandsOn(X) ∧ hasLowCodingSkills(X)
      //           → suitableFor(X, CoreEngineering) ]
      conditions: (student) =>
        ["Mechanical", "Civil", "Electrical", "Electronics"].includes(student.profile.branch) &&
        student.skills.practical_skills >= 7 &&
        student.interests.hands_on_work === "high" &&
        student.skills.coding_skills < 5,
      
      cf: 0.80,
      
      rationale: "Strong practical skills and hands-on interest align with core engineering industry needs. " +
                 "Manufacturing, construction, and industrial sectors require domain expertise.",
      
      actionSteps: [
        "Gain internships in core companies (L&T, Tata Steel, etc.)",
        "Learn industry tools: AutoCAD, SolidWorks, ANSYS (branch-specific)",
        "Target campus placements in manufacturing sector",
        "Consider MBA (Operations) for management roles later"
      ],
      
      expectedSalary: "Medium (3-7 LPA for freshers)",
      workLifeBalance: "Medium (depends on company)",
      jobSecurity: "Medium"
    },

    // ─── RULE 8: STARTUP JOBS (High-Growth Startups) ──────────
    {
      id: "CAREER_R008",
      name: "Startup Jobs (High-Growth Companies)",
      category: "Technical",
      priority: "Medium",
      
      // FOL: ∀X [ hasHighRiskAppetite(X) ∧ hasHighCodingSkills(X) ∧ 
      //           (hasMediumCGPA(X) ∨ hasHighCGPA(X)) ∧ hasHighLeadership(X)
      //           → suitableFor(X, Startups) ]
      conditions: (student) =>
        student.personality.risk_appetite === "high" &&
        student.skills.coding_skills >= 7 &&
        student.cgpa >= 6.5 &&
        student.personality.leadership >= 6 &&
        student.personality.work_life_balance_priority !== "high",
      
      cf: 0.78,
      
      rationale: "High risk tolerance with technical skills. Startups offer rapid learning, ownership, " +
                 "and equity opportunities in exchange for lower initial salary and work-life balance.",
      
      actionSteps: [
        "Identify fast-growing startups (Unicorns, Soonicorns)",
        "Build strong portfolio with hackathon wins",
        "Apply via AngelList, Cutshort, or direct referrals",
        "Be prepared for multiple roles and rapid context switching",
        "Negotiate for equity/ESOPs along with salary"
      ],
      
      expectedSalary: "Medium-High (5-12 LPA + equity)",
      workLifeBalance: "Low",
      jobSecurity: "Low-Medium"
    },

    // ─── RULE 9: MBA (Management Studies) ─────────────────────
    {
      id: "CAREER_R009",
      name: "Higher Studies (MBA)",
      category: "Business",
      priority: "Medium",
      
      // FOL: ∀X [ (hasHighCGPA(X) ∨ hasMediumCGPA(X)) ∧ 
      //           interestedInManagement(X) ∧ hasHighCommunication(X) ∧
      //           hasLeadership(X) → suitableFor(X, MBA) ]
      conditions: (student) =>
        student.cgpa >= 7.0 &&
        student.interests.management === "high" &&
        student.skills.communication_skills >= 7 &&
        student.personality.leadership >= 6 &&
        (student.constraints.financial_constraint === "low" ||
         student.constraints.financial_constraint === "medium"),
      
      cf: 0.83,
      
      rationale: "Interest in management with leadership potential. MBA opens doors to consulting, " +
                 "product management, and business leadership roles.",
      
      actionSteps: [
        "Prepare for CAT/GMAT/XAT exams",
        "Gain 1-2 years work experience (preferred by top B-schools)",
        "Target IIMs, ISB, FMS, XLRI for India; Harvard, Stanford for abroad",
        "Build profile: leadership roles, social impact, extracurriculars",
        "Network with alumni for interview preparation"
      ],
      
      expectedSalary: "High (15-30 LPA from top B-schools)",
      workLifeBalance: "Medium",
      jobSecurity: "High"
    },

    // ─── RULE 10: SKILL DEVELOPMENT / CAREER COUNSELING ───────
    {
      id: "CAREER_R010",
      name: "Skill Development Programs",
      category: "Training",
      priority: "Low",
      
      // Fallback for students with low scores across metrics
      conditions: (student) =>
        student.cgpa < 6.5 &&
        student.skills.coding_skills < 5 &&
        student.skills.analytical_skills < 6 &&
        student.academic_achievements.projects_completed < 2,
      
      cf: 0.65,
      
      rationale: "Current profile needs strengthening. Focus on skill development before entering job market " +
                 "to improve career prospects and confidence.",
      
      actionSteps: [
        "Enroll in intensive skill development bootcamps",
        "Target specific skills: Full Stack Dev, Data Analytics, Digital Marketing",
        "Complete 2-3 substantial projects to build portfolio",
        "Consider 6-month diploma/certification programs",
        "Seek career counseling for personalized guidance"
      ],
      
      expectedSalary: "Low-Medium (2-4 LPA after upskilling)",
      workLifeBalance: "High (during training)",
      jobSecurity: "Depends on skill acquisition"
    }
  ],

  // ═══════════════════════════════════════════════════════════
  // CONSTRAINT RULES (Filtering & Penalization)
  // ═══════════════════════════════════════════════════════════

  constraintRules: [
    
    // Financial Constraint Rule
    {
      id: "CONST_R001",
      name: "Financial Constraint - Higher Studies",
      
      // FOL: ∀X ∀C [ hasFinancialConstraint(X) ∧ C = HigherStudies ∧
      //              ¬scholarship_eligible(X) → penalize(X, C, -0.15) ]
      applies: (student, careerPath) =>
        student.constraints.financial_constraint === "high" &&
        careerPath.name.includes("Higher Studies"),
      
      effect: "penalize",
      penalty: -0.15,
      
      reason: "High financial constraints make self-funded higher studies difficult. " +
              "Consider scholarships, assistantships, or work experience first."
    },

    // Immediate Job Requirement Rule
    {
      id: "CONST_R002",
      name: "Immediate Income Requirement",
      
      // FOL: ∀X ∀C [ needsImmediateJob(X) ∧ C ∈ {HigherStudies, Entrepreneurship}
      //              → penalize(X, C, -0.20) ]
      applies: (student, careerPath) =>
        student.constraints.family_pressure_immediate_job === true &&
        (careerPath.name.includes("Higher Studies") || 
         careerPath.name.includes("Entrepreneurship")),
      
      effect: "penalize",
      penalty: -0.20,
      
      reason: "Family pressure for immediate employment makes delayed-income paths less feasible. " +
              "Prioritize job-oriented options."
    },

    // CGPA Minimum for Product Companies
    {
      id: "CONST_R003",
      name: "CGPA Cutoff - Product Companies",
      
      applies: (student, careerPath) =>
        student.cgpa < 7.0 &&
        careerPath.id === "CAREER_R001",
      
      effect: "penalize",
      penalty: -0.25,
      
      reason: "Most product companies have strict CGPA cutoffs (typically 7.0+). " +
              "Consider service companies or skill-based roles instead."
    },

    // Age Factor for Competitive Exams
    {
      id: "CONST_R004",
      name: "Age Consideration - Competitive Exams",
      
      applies: (student, careerPath) =>
        student.profile.age > 25 &&
        careerPath.id === "CAREER_R006",
      
      effect: "boost",
      boost: 0.05,
      
      reason: "Limited attempts remaining for age-restricted exams. Higher urgency."
    }
  ],

  // ═══════════════════════════════════════════════════════════
  // PRIORITY BOOST RULES
  // ═══════════════════════════════════════════════════════════

  boostRules: [
    
    // Internship Boost
    {
      id: "BOOST_R001",
      name: "Multiple Internships Boost",
      
      applies: (student, careerPath) =>
        student.academic_achievements.internships >= 2 &&
        (careerPath.category === "Technical" || careerPath.category === "Business"),
      
      boost: 0.05,
      
      reason: "Multiple internships demonstrate practical experience and industry exposure."
    },

    // Publication Boost (Research)
    {
      id: "BOOST_R002",
      name: "Research Publication Boost",
      
      applies: (student, careerPath) =>
        student.academic_achievements.publications > 0 &&
        careerPath.id === "CAREER_R003",
      
      boost: 0.08,
      
      reason: "Publications strengthen research profile significantly for graduate admissions."
    },

    // Leadership Boost
    {
      id: "BOOST_R003",
      name: "Strong Leadership Profile",
      
      applies: (student, careerPath) =>
        student.personality.leadership >= 8 &&
        (careerPath.id === "CAREER_R005" || careerPath.id === "CAREER_R009"),
      
      boost: 0.12,
      
      reason: "Exceptional leadership qualities are critical for entrepreneurship and management roles."
    },

    // Certification Boost
    {
      id: "BOOST_R004",
      name: "Relevant Certifications",
      
      applies: (student, careerPath) =>
        student.academic_achievements.certifications &&
        student.academic_achievements.certifications.length >= 2,
      
      boost: 0.03,
      
      reason: "Multiple certifications show continuous learning and skill development."
    }
  ]
};

module.exports = knowledgeBase;