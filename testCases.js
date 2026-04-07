/**
 * TEST CASES — Career Path Recommendation System
 * 
 * Purpose: Validate the inference engine with diverse student profiles
 * Based on: roo_data.csv dataset patterns
 */

const InferenceEngine = require("./inferenceEngine");

// Test Case Data
const testCases = [
  
  // ═══════════════════════════════════════════════════════════
  // TEST CASE 1: High Achiever with Research Interest
  // ═══════════════════════════════════════════════════════════
  {
    id: "TC_001",
    description: "Excellent student interested in research → Should recommend Higher Studies",
    studentProfile: {
      profile: {
        cgpa: 8.7,
        branch: "Computer Science",
        year: 4,
        age: 21
      },
      skills: {
        coding_skills: 9,
        analytical_skills: 8,
        communication_skills: 7,
        problem_solving: 9,
        practical_skills: 6
      },
      interests: {
        coding: "high",
        research: "high",
        management: "low",
        hands_on_work: "medium"
      },
      personality: {
        risk_appetite: "medium",
        leadership: 7,
        patience_level: "high",
        work_life_balance_priority: "medium"
      },
      academic_achievements: {
        projects_completed: 5,
        publications: 1,
        internships: 2,
        certifications: ["AWS", "Machine Learning"]
      },
      constraints: {
        financial_constraint: "low",
        family_pressure_immediate_job: false,
        location_preference: "flexible",
        salary_expectation: "high"
      }
    },
    expectedTopRecommendation: "Higher Studies (MS/MTech/PhD)"
  },

  // ═══════════════════════════════════════════════════════════
  // TEST CASE 2: Strong Coder, Job-Oriented
  // ═══════════════════════════════════════════════════════════
  {
    id: "TC_002",
    description: "Strong technical skills, wants immediate job → Software Development",
    studentProfile: {
      profile: {
        cgpa: 7.8,
        branch: "Computer Science",
        year: 4,
        age: 22
      },
      skills: {
        coding_skills: 8,
        analytical_skills: 7,
        communication_skills: 8,
        problem_solving: 8,
        practical_skills: 7
      },
      interests: {
        coding: "high",
        research: "low",
        management: "medium",
        hands_on_work: "medium"
      },
      personality: {
        risk_appetite: "low",
        leadership: 6,
        patience_level: "medium",
        work_life_balance_priority: "medium"
      },
      academic_achievements: {
        projects_completed: 4,
        publications: 0,
        internships: 2,
        certifications: ["Java", "React"]
      },
      constraints: {
        financial_constraint: "medium",
        family_pressure_immediate_job: false,
        location_preference: "metro_cities",
        salary_expectation: "medium"
      }
    },
    expectedTopRecommendation: "Software Development - Product Companies"
  },

  // ═══════════════════════════════════════════════════════════
  // TEST CASE 3: Core Engineering Student
  // ═══════════════════════════════════════════════════════════
  {
    id: "TC_003",
    description: "Mechanical student with practical skills → Core Engineering",
    studentProfile: {
      profile: {
        cgpa: 6.2,
        branch: "Mechanical",
        year: 4,
        age: 21
      },
      skills: {
        coding_skills: 3,
        analytical_skills: 6,
        communication_skills: 6,
        problem_solving: 6,
        practical_skills: 9
      },
      interests: {
        coding: "low",
        research: "low",
        management: "low",
        hands_on_work: "high"
      },
      personality: {
        risk_appetite: "low",
        leadership: 5,
        patience_level: "medium",
        work_life_balance_priority: "high"
      },
      academic_achievements: {
        projects_completed: 2,
        publications: 0,
        internships: 1,
        certifications: ["AutoCAD"]
      },
      constraints: {
        financial_constraint: "high",
        family_pressure_immediate_job: true,
        location_preference: "hometown",
        salary_expectation: "low"
      }
    },
    expectedTopRecommendation: "Core Engineering (Industry Roles)"
  },

  // ═══════════════════════════════════════════════════════════
  // TEST CASE 4: Data Science Profile
  // ═══════════════════════════════════════════════════════════
  {
    id: "TC_004",
    description: "High analytical + coding skills → Data Science",
    studentProfile: {
      profile: {
        cgpa: 8.2,
        branch: "Computer Science",
        year: 4,
        age: 22
      },
      skills: {
        coding_skills: 8,
        analytical_skills: 9,
        communication_skills: 7,
        problem_solving: 8,
        practical_skills: 6
      },
      interests: {
        coding: "high",
        research: "medium",
        management: "low",
        hands_on_work: "low"
      },
      personality: {
        risk_appetite: "medium",
        leadership: 6,
        patience_level: "medium",
        work_life_balance_priority: "low"
      },
      academic_achievements: {
        projects_completed: 6,
        publications: 0,
        internships: 3,
        certifications: ["Python", "Data Science", "SQL"]
      },
      constraints: {
        financial_constraint: "low",
        family_pressure_immediate_job: false,
        location_preference: "flexible",
        salary_expectation: "high"
      }
    },
    expectedTopRecommendation: "Data Science & Analytics"
  },

  // ═══════════════════════════════════════════════════════════
  // TEST CASE 5: Entrepreneurial Profile
  // ═══════════════════════════════════════════════════════════
  {
    id: "TC_005",
    description: "High risk appetite + leadership → Entrepreneurship",
    studentProfile: {
      profile: {
        cgpa: 7.5,
        branch: "Electronics",
        year: 4,
        age: 21
      },
      skills: {
        coding_skills: 6,
        analytical_skills: 7,
        communication_skills: 8,
        problem_solving: 7,
        practical_skills: 7
      },
      interests: {
        coding: "medium",
        research: "low",
        management: "high",
        hands_on_work: "medium"
      },
      personality: {
        risk_appetite: "high",
        leadership: 9,
        patience_level: "high",
        work_life_balance_priority: "low"
      },
      academic_achievements: {
        projects_completed: 3,
        publications: 0,
        internships: 1,
        certifications: ["Digital Marketing"]
      },
      constraints: {
        financial_constraint: "medium",
        family_pressure_immediate_job: false,
        location_preference: "flexible",
        salary_expectation: "medium"
      }
    },
    expectedTopRecommendation: "Entrepreneurship / Startup Founder"
  },

  // ═══════════════════════════════════════════════════════════
  // TEST CASE 6: Government Job Seeker
  // ═══════════════════════════════════════════════════════════
  {
    id: "TC_006",
    description: "Work-life balance + job security preference → Government Jobs",
    studentProfile: {
      profile: {
        cgpa: 7.9,
        branch: "Civil",
        year: 4,
        age: 22
      },
      skills: {
        coding_skills: 4,
        analytical_skills: 7,
        communication_skills: 7,
        problem_solving: 7,
        practical_skills: 8
      },
      interests: {
        coding: "low",
        research: "low",
        management: "medium",
        hands_on_work: "high"
      },
      personality: {
        risk_appetite: "low",
        leadership: 6,
        patience_level: "high",
        work_life_balance_priority: "high"
      },
      academic_achievements: {
        projects_completed: 2,
        publications: 0,
        internships: 1,
        certifications: ["GATE Prep"]
      },
      constraints: {
        financial_constraint: "medium",
        family_pressure_immediate_job: false,
        location_preference: "flexible",
        salary_expectation: "medium"
      }
    },
    expectedTopRecommendation: "Government Jobs (GATE/PSU/Civil Services)"
  }
];

// ═══════════════════════════════════════════════════════════
// RUN TESTS
// ═══════════════════════════════════════════════════════════

function runTests() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  CAREER PATH RECOMMENDATION SYSTEM - TEST SUITE              ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  let passedTests = 0;
  let failedTests = 0;

  testCases.forEach((testCase, index) => {
    console.log(`\n${"=".repeat(65)}`);
    console.log(`TEST CASE ${testCase.id}: ${testCase.description}`);
    console.log("=".repeat(65));

    const engine = new InferenceEngine();
    const result = engine.run(testCase.studentProfile);

    console.log("\n📊 STUDENT PROFILE:");
    console.log(`   CGPA: ${result.studentSummary.profile.cgpa}`);
    console.log(`   Branch: ${result.studentSummary.profile.branch}`);
    console.log(`   Skills: Coding=${result.studentSummary.skills.coding}, ` +
                `Analytical=${result.studentSummary.skills.analytical}`);

    console.log("\n🎯 TOP RECOMMENDATIONS:");
    result.recommendations.forEach((rec, idx) => {
      console.log(`   ${idx + 1}. ${rec.name} — ${rec.confidencePercentage}`);
      if (rec.explanation) {
        console.log(`      Primary Factors: ${rec.explanation.primaryFactors.slice(0, 2).join(", ")}`);
      }
    });

    console.log("\n🔥 RULES FIRED:");
    console.log(`   ${result.firedRules.length} rules triggered: ${result.firedRules.slice(0, 5).join(", ")}...`);

    console.log(`\n⏱️  Execution Time: ${result.executionTime}`);

    // Validation
    const topRecommendation = result.recommendations[0]?.name || "None";
    const expected = testCase.expectedTopRecommendation;
    
    if (topRecommendation.includes(expected) || expected.includes(topRecommendation)) {
      console.log(`\n✅ TEST PASSED: Expected "${expected}", Got "${topRecommendation}"`);
      passedTests++;
    } else {
      console.log(`\n❌ TEST FAILED: Expected "${expected}", Got "${topRecommendation}"`);
      failedTests++;
    }
  });

  console.log("\n\n╔══════════════════════════════════════════════════════════════╗");
  console.log(`║  TEST SUMMARY: ${passedTests} Passed, ${failedTests} Failed (${testCases.length} Total)         ║`);
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
}

// Run if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testCases, runTests };