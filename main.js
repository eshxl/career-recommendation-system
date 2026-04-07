/**
 * MAIN APPLICATION — Career Path Recommendation System
 * 
 * Entry point for running the intelligent decision-making system
 * Demonstrates knowledge engineering principles in action
 */

const InferenceEngine = require("./inferenceEngine");
const fs = require("fs");

// Sample student profile (can be loaded from CSV or user input)
const sampleStudent = {
  profile: {
    cgpa: 8.5,
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
    certifications: ["AWS", "Machine Learning", "Deep Learning"]
  },
  constraints: {
    financial_constraint: "low",
    family_pressure_immediate_job: false,
    location_preference: "flexible",
    salary_expectation: "high"
  }
};

/**
 * Generate comprehensive recommendation report
 */
function generateReport(result) {
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║                 CAREER PATH RECOMMENDATION REPORT                 ║");
  console.log("║          Intelligent Decision-Making System using AI             ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  
  // Student Summary
  console.log("\n📋 STUDENT PROFILE SUMMARY:");
  console.log("─".repeat(68));
  const profile = result.studentSummary.profile;
  const skills = result.studentSummary.skills;
  const achievements = result.studentSummary.achievements;
  
  console.log(`   Academic Performance: CGPA ${profile.cgpa}/10 (${profile.branch})`);
  console.log(`   Technical Skills: Coding=${skills.coding}/10, Analytical=${skills.analytical}/10`);
  console.log(`   Achievements: ${achievements.projects} Projects, ${achievements.internships} Internships, ${achievements.publications} Publications`);
  console.log(`   Certifications: ${achievements.certifications} completed`);
  
  // Recommendations
  console.log("\n\n🎯 TOP CAREER PATH RECOMMENDATIONS:");
  console.log("─".repeat(68));
  
  result.recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.name.toUpperCase()}`);
    console.log(`   Confidence Score: ${rec.confidencePercentage} (Base: ${(rec.baseCF * 100).toFixed(1)}%)`);
    console.log(`   Category: ${rec.category} | Priority: ${rec.priority}`);
    
    console.log(`\n   💡 Why This Path:`);
    console.log(`   ${rec.rationale}`);
    
    if (rec.explanation) {
      if (rec.explanation.primaryFactors.length > 0) {
        console.log(`\n   ✓ Key Matching Factors:`);
        rec.explanation.primaryFactors.forEach(factor => {
          console.log(`      • ${factor}`);
        });
      }
      
      if (rec.explanation.supportingFactors.length > 0) {
        console.log(`\n   + Supporting Factors:`);
        rec.explanation.supportingFactors.slice(0, 3).forEach(factor => {
          console.log(`      • ${factor}`);
        });
      }
      
      if (rec.boosts && rec.boosts.length > 0) {
        console.log(`\n   ↑ Confidence Boosters:`);
        rec.boosts.forEach(boost => {
          console.log(`      • ${boost.reason} (+${(boost.value * 100).toFixed(1)}%)`);
        });
      }
      
      if (rec.constraints && rec.constraints.length > 0) {
        console.log(`\n   ⚠️  Constraints Applied:`);
        rec.constraints.forEach(constraint => {
          console.log(`      • ${constraint.reason} (${(constraint.impact * 100).toFixed(1)}%)`);
        });
      }
    }
    
    console.log(`\n   📍 Next Steps:`);
    rec.actionSteps.slice(0, 4).forEach((step, i) => {
      console.log(`      ${i + 1}. ${step}`);
    });
    
    console.log(`\n   💰 Expected Salary: ${rec.expectedSalary}`);
    console.log(`   ⚖️  Work-Life Balance: ${rec.workLifeBalance} | Job Security: ${rec.jobSecurity}`);
    
    if (index < result.recommendations.length - 1) {
      console.log("\n" + "─".repeat(68));
    }
  });
  
  // Reasoning Trace
  console.log("\n\n🔍 REASONING TRACE (Explainability):");
  console.log("─".repeat(68));
  console.log(`   Total Rules Evaluated: ${result.trace.length}`);
  console.log(`   Rules Fired: ${result.firedRules.length}`);
  console.log(`   Execution Time: ${result.executionTime}`);
  
  console.log(`\n   Key Decision Steps:`);
  const importantLogs = result.trace
    .filter(t => t.source === "Career Rule" && t.message.includes("FIRED"))
    .slice(0, 5);
  
  importantLogs.forEach((log, i) => {
    const ruleName = log.message.match(/→ "(.*?)"/)?.[1] || "Unknown";
    console.log(`      ${i + 1}. Matched: ${ruleName}`);
  });
  
  console.log("\n" + "=".repeat(68));
  console.log(`Report Generated: ${result.timestamp}`);
  console.log("=".repeat(68) + "\n");
}

/**
 * Save detailed report to file
 */
function saveReportToFile(result, filename = "career_recommendation_report.json") {
  const reportData = {
    metadata: {
      system: "Career Path Recommendation System",
      version: "1.0.0",
      algorithm: "Forward Chaining with Confidence Scoring",
      dataset: "roo_data.csv (Om Baval, 2024)",
      timestamp: result.timestamp
    },
    student: result.studentSummary,
    recommendations: result.recommendations,
    reasoning: {
      firedRules: result.firedRules,
      totalRulesEvaluated: result.trace.length,
      executionTime: result.executionTime
    },
    trace: result.trace
  };
  
  fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
  console.log(`✅ Detailed report saved to: ${filename}\n`);
}

/**
 * Main execution
 */
function main() {
  console.log("\n🚀 Starting Career Path Recommendation System...\n");
  
  // Create inference engine instance
  const engine = new InferenceEngine();
  
  // Run inference
  const result = engine.run(sampleStudent);
  
  // Generate and display report
  generateReport(result);
  
  // Save to file
  saveReportToFile(result);
  
  console.log("✨ Recommendation complete! System demonstrated:");
  console.log("   ✓ Knowledge Acquisition (from roo_data.csv dataset)");
  console.log("   ✓ Knowledge Representation (FOL + Rule-based)");
  console.log("   ✓ Forward Chaining Reasoning");
  console.log("   ✓ Conflict Resolution (Confidence-based ranking)");
  console.log("   ✓ Explanation Generation (Full reasoning trace)\n");
}

// Run application
if (require.main === module) {
  main();
}

module.exports = { generateReport, saveReportToFile };