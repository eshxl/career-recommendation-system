/**
 * INFERENCE ENGINE — Career Path Recommendation System
 * Algorithm: Forward Chaining with Confidence Scoring
 * 
 * Process Flow:
 * 1. Load student profile into Working Memory
 * 2. Match student attributes against Career Rules → derive suitable paths
 * 3. Apply Constraint Rules → filter/penalize recommendations
 * 4. Apply Boost Rules → enhance confidence scores
 * 5. Rank recommendations by final confidence score
 * 6. Generate explanation trace (reasoning path)
 * 7. Return top 3 recommendations with justifications
 */

const kb = require("./knowledgeBase");

class InferenceEngine {
  constructor() {
    this.workingMemory = {};
    this.firedRules = [];
    this.trace = [];
    this.recommendations = [];
  }

  /**
   * Load student profile into working memory
   * Initializes facts from student data
   */
  loadStudentProfile(studentProfile) {
    this.workingMemory = {
      // Profile defaults
      profile: {
        cgpa: 0,
        branch: "Unknown",
        year: 4,
        age: 21,
        ...studentProfile.profile
      },
      
      skills: {
        coding_skills: 0,
        analytical_skills: 0,
        communication_skills: 0,
        problem_solving: 0,
        practical_skills: 0,
        ...studentProfile.skills
      },
      
      interests: {
        coding: "low",
        research: "low",
        management: "low",
        hands_on_work: "low",
        ...studentProfile.interests
      },
      
      personality: {
        risk_appetite: "low",
        leadership: 0,
        patience_level: "medium",
        work_life_balance_priority: "medium",
        ...studentProfile.personality
      },
      
      academic_achievements: {
        projects_completed: 0,
        publications: 0,
        internships: 0,
        certifications: [],
        ...studentProfile.academic_achievements
      },
      
      constraints: {
        financial_constraint: "medium",
        family_pressure_immediate_job: false,
        location_preference: "flexible",
        salary_expectation: "medium",
        ...studentProfile.constraints
      }
    };

    // Flatten for easier access
    this.workingMemory.cgpa = this.workingMemory.profile.cgpa;
    
    this.firedRules = [];
    this.trace = [];
    this.recommendations = [];
    
    this.log("System", `Working memory initialized for student profile.`);
    this.log("Profile", `CGPA: ${this.workingMemory.cgpa}, Branch: ${this.workingMemory.profile.branch}`);
  }

  /**
   * PHASE 1: Match student profile against all career rules
   * Forward Chaining: Facts → Rules → Conclusions
   */
  runCareerMatchingRules() {
    this.log("Engine", "=== PHASE 1: Career Rule Matching (Forward Chaining) ===");
    
    const matchedCareers = [];

    for (const rule of kb.careerRules) {
      try {
        // Evaluate rule condition (FOL predicate evaluation)
        if (rule.conditions(this.workingMemory)) {
          
          // Calculate base confidence
          let baseCF = rule.cf;
          
          // Apply rule-specific boost if defined
          if (rule.boost && typeof rule.boost === 'function') {
            const boostValue = rule.boost(this.workingMemory);
            baseCF += boostValue;
            
            if (boostValue > 0) {
              this.log("Boost", `[${rule.id}] +${boostValue.toFixed(2)} boost applied`);
            }
          }
          
          matchedCareers.push({
            id: rule.id,
            name: rule.name,
            category: rule.category,
            priority: rule.priority,
            baseCF: parseFloat(baseCF.toFixed(3)),
            finalCF: parseFloat(baseCF.toFixed(3)), // Will be adjusted in next phases
            rationale: rule.rationale,
            actionSteps: rule.actionSteps,
            expectedSalary: rule.expectedSalary,
            workLifeBalance: rule.workLifeBalance,
            jobSecurity: rule.jobSecurity
          });
          
          this.firedRules.push(rule.id);
          this.log(
            "Career Rule",
            `✓ [${rule.id}] FIRED → "${rule.name}" (Base CF: ${baseCF.toFixed(2)})`
          );
        }
      } catch (error) {
        // Rule condition not satisfied or fact missing
        this.log("Career Rule", `✗ [${rule.id}] NOT FIRED — Conditions not met`);
      }
    }

    this.log("Engine", `${matchedCareers.length} career path(s) matched initial criteria.`);
    return matchedCareers;
  }

  /**
   * PHASE 2: Apply constraint rules to filter/penalize recommendations
   * FOL Constraint Rules: Modify confidence based on limitations
   */
  applyConstraintRules(matchedCareers) {
    this.log("Engine", "=== PHASE 2: Applying Constraint Rules ===");
    
    for (const career of matchedCareers) {
      for (const constRule of kb.constraintRules) {
        try {
          if (constRule.applies(this.workingMemory, career)) {
            
            if (constRule.effect === "penalize") {
              career.finalCF += constRule.penalty;
              career.finalCF = Math.max(career.finalCF, 0.1); // Floor at 0.1
              
              this.firedRules.push(constRule.id);
              this.log(
                "Constraint Rule",
                `⚠ [${constRule.id}] Applied to "${career.name}" — Penalty: ${constRule.penalty.toFixed(2)} | Reason: ${constRule.reason}`
              );
              
              // Store constraint violation
              if (!career.constraints) career.constraints = [];
              career.constraints.push({
                rule: constRule.id,
                reason: constRule.reason,
                impact: constRule.penalty
              });
            }
            
            if (constRule.effect === "boost") {
              career.finalCF += constRule.boost;
              career.finalCF = Math.min(career.finalCF, 0.98); // Ceiling at 0.98
              
              this.log(
                "Constraint Rule",
                `↑ [${constRule.id}] Applied to "${career.name}" — Boost: +${constRule.boost.toFixed(2)}`
              );
            }
          }
        } catch (error) {
          // Constraint rule not applicable
        }
      }
    }
    
    return matchedCareers;
  }

  /**
   * PHASE 3: Apply boost rules based on exceptional achievements
   */
  applyBoostRules(matchedCareers) {
    this.log("Engine", "=== PHASE 3: Applying Boost Rules ===");
    
    for (const career of matchedCareers) {
      for (const boostRule of kb.boostRules) {
        try {
          if (boostRule.applies(this.workingMemory, career)) {
            career.finalCF += boostRule.boost;
            career.finalCF = Math.min(career.finalCF, 0.98); // Max 98%
            
            this.firedRules.push(boostRule.id);
            this.log(
              "Boost Rule",
              `↑ [${boostRule.id}] Applied to "${career.name}" — Boost: +${boostRule.boost.toFixed(2)} | Reason: ${boostRule.reason}`
            );
            
            if (!career.boosts) career.boosts = [];
            career.boosts.push({
              rule: boostRule.id,
              reason: boostRule.reason,
              value: boostRule.boost
            });
          }
        } catch (error) {
          // Boost rule not applicable
        }
      }
    }
    
    return matchedCareers;
  }

  /**
   * PHASE 4: Rank and select top recommendations
   * Priority: Emergency > finalCF descending
   */
  rankRecommendations(matchedCareers) {
    this.log("Engine", "=== PHASE 4: Ranking Recommendations ===");
    
    // Sort by final confidence (descending)
    // inferenceEngine.js - rankRecommendations()
    const ranked = matchedCareers.sort((a, b) => {
      if (a.priority === "EMERGENCY") return -1;
      if (b.priority === "EMERGENCY") return 1;
      
      // Primary: Sort by confidence
      if (b.finalCF !== a.finalCF) {
        return b.finalCF - a.finalCF;
      }
      
      // TIE-BREAKER 1: Prefer exact interest match
      // If student has "research" interest = high, prioritize research paths
      const aMatchesInterest = this.pathMatchesTopInterest(a, this.workingMemory);
      const bMatchesInterest = this.pathMatchesTopInterest(b, this.workingMemory);
      if (aMatchesInterest && !bMatchesInterest) return -1;
      if (bMatchesInterest && !aMatchesInterest) return 1;
      
      // TIE-BREAKER 2: Higher base CF (before boosts)
      if (b.baseCF !== a.baseCF) {
        return b.baseCF - a.baseCF;
      }
      
      // TIE-BREAKER 3: Priority level
      const priorityOrder = { "High": 3, "Medium": 2, "Low": 1, "EMERGENCY": 4 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    // Select top 3
    const topRecommendations = ranked.slice(0, 3);
    
    topRecommendations.forEach((rec, index) => {
      rec.rank = index + 1;
      rec.confidencePercentage = `${(rec.finalCF * 100).toFixed(1)}%`;
      
      this.log(
        "Ranking",
        `#${rec.rank}: ${rec.name} — Confidence: ${rec.confidencePercentage} (Base: ${(rec.baseCF * 100).toFixed(1)}%)`
      );
    });
    
    return topRecommendations;
  }

  /**
   * Generate student summary for report
   */
  buildStudentSummary() {
    const s = this.workingMemory;
    return {
      profile: {
        cgpa: s.cgpa,
        branch: s.profile.branch,
        age: s.profile.age,
        year: s.profile.year
      },
      skills: {
        coding: s.skills.coding_skills,
        analytical: s.skills.analytical_skills,
        communication: s.skills.communication_skills,
        problemSolving: s.skills.problem_solving,
        practical: s.skills.practical_skills
      },
      interests: { ...s.interests },
      personality: { ...s.personality },
      achievements: {
        projects: s.academic_achievements.projects_completed,
        publications: s.academic_achievements.publications,
        internships: s.academic_achievements.internships,
        certifications: s.academic_achievements.certifications?.length || 0
      },
      constraints: { ...s.constraints }
    };
  }

  /**
   * Generate explanation for WHY a specific career was recommended
   */
  generateExplanation(recommendation) {
    const explanation = {
      career: recommendation.name,
      confidence: recommendation.confidencePercentage,
      rank: recommendation.rank,
      
      primaryFactors: [],
      supportingFactors: [],
      constraints: recommendation.constraints || [],
      boosts: recommendation.boosts || [],
      
      reasoning: recommendation.rationale,
      nextSteps: recommendation.actionSteps
    };
    
    // Extract which conditions were satisfied (simplified)
    const s = this.workingMemory;
    
    if (s.cgpa >= 8.0) {
      explanation.primaryFactors.push(`Excellent CGPA (${s.cgpa}) meets high academic standards`);
    } else if (s.cgpa >= 7.0) {
      explanation.primaryFactors.push(`Good CGPA (${s.cgpa}) meets requirements`);
    }
    
    if (s.skills.coding_skills >= 7) {
      explanation.primaryFactors.push(`Strong coding skills (${s.skills.coding_skills}/10)`);
    }
    
    if (s.skills.analytical_skills >= 7) {
      explanation.primaryFactors.push(`High analytical ability (${s.skills.analytical_skills}/10)`);
    }
    
    if (s.interests.coding === "high") {
      explanation.supportingFactors.push("High interest in coding/programming");
    }
    
    if (s.interests.research === "high") {
      explanation.supportingFactors.push("Strong research interest");
    }
    
    if (s.academic_achievements.projects_completed >= 3) {
      explanation.supportingFactors.push(`Completed ${s.academic_achievements.projects_completed} projects`);
    }
    
    if (s.academic_achievements.internships >= 2) {
      explanation.supportingFactors.push(`${s.academic_achievements.internships} internship experiences`);
    }
    
    if (s.academic_achievements.publications > 0) {
      explanation.supportingFactors.push(`${s.academic_achievements.publications} publication(s)`);
    }
    
    return explanation;
  }

  pathMatchesTopInterest(career, workingMemory) {
    const interests = workingMemory.interests;
    const skills = workingMemory.skills;
    const personality = workingMemory.personality;
    
    const highInterests = Object.keys(interests).filter(k => interests[k] === "high");
    
    // Research alignment
    if (highInterests.includes("research") && career.id === "CAREER_R003") return true;
    
    // Coding alignment
    if (highInterests.includes("coding")) {
      if (career.id === "CAREER_R001") return true;  // Software Dev
      if (career.id === "CAREER_R004" && skills.analytical_skills >= 8) return true;  // Data Science
    }
    
    // Management alignment
    if (highInterests.includes("management")) {
      if (career.id === "CAREER_R009") return true;  // MBA
    }
    
    // Entrepreneurship (kept stricter from second version)
    if (career.id === "CAREER_R005" && 
        personality.leadership >= 8 && 
        personality.risk_appetite === "high") return true;
    
    // Hands-on alignment
    if (highInterests.includes("hands_on_work") && career.id === "CAREER_R007") return true;
    
    return false;
  }

  /**
   * MAIN INFERENCE CYCLE
   * Orchestrates all phases of reasoning
   */
  run(studentProfile) {
    const startTime = Date.now();
    
    // Initialize
    this.loadStudentProfile(studentProfile);
    this.log("Engine", "╔═══════════════════════════════════════════════════════════╗");
    this.log("Engine", "║   CAREER PATH RECOMMENDATION - INFERENCE ENGINE          ║");
    this.log("Engine", "║   Algorithm: Forward Chaining with Confidence Scoring    ║");
    this.log("Engine", "╚═══════════════════════════════════════════════════════════╝");
    
    // Phase 1: Match careers
    let matchedCareers = this.runCareerMatchingRules();
    
    if (matchedCareers.length === 0) {
      this.log("Engine", "⚠ No career paths matched. Returning skill development recommendation.");
      
      // Fallback recommendation
      return {
        studentSummary: this.buildStudentSummary(),
        recommendations: [{
          rank: 1,
          name: "Career Counseling Required",
          confidencePercentage: "N/A",
          rationale: "Profile needs further development. Recommend meeting with career counselor.",
          actionSteps: [
            "Schedule career counseling session",
            "Identify skill gaps",
            "Create personalized development plan"
          ]
        }],
        firedRules: [...new Set(this.firedRules)],
        trace: this.trace,
        executionTime: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      };
    }
    
    // Phase 2: Apply constraints
    matchedCareers = this.applyConstraintRules(matchedCareers);
    
    // Phase 3: Apply boosts
    matchedCareers = this.applyBoostRules(matchedCareers);
    
    // Phase 4: Rank and select
    const topRecommendations = this.rankRecommendations(matchedCareers);
    
    // Generate explanations
    const recommendationsWithExplanations = topRecommendations.map(rec => ({
      ...rec,
      explanation: this.generateExplanation(rec)
    }));
    
    const executionTime = Date.now() - startTime;
    this.log("Engine", `✓ Inference complete in ${executionTime}ms`);
    this.log("Engine", `Recommendations: ${topRecommendations.length} career paths suggested`);
    
    // Return complete result
    return {
      studentSummary: this.buildStudentSummary(),
      recommendations: recommendationsWithExplanations,
      allMatchedCareers: matchedCareers,
      firedRules: [...new Set(this.firedRules)],
      trace: this.trace,
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Utility: Log events to trace
   */
  log(source, message) {
    const entry = {
      source,
      message,
      timestamp: new Date().toISOString()
    };
    this.trace.push(entry);
    
    // Optional: Console logging for debugging
    // console.log(`[${source}] ${message}`);
  }
}

module.exports = InferenceEngine;