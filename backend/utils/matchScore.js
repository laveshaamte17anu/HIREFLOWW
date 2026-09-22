/**
 * Rule-based Job Match Score calculation algorithm.
 * Evaluates candidate details against job requirements.
 */
function calculateMatchScore(candidate, job) {
  let score = 0;
  const breakdown = {
    matchedSkills: [],
    missingSkills: [],
    experienceMatch: 'Needs Review',
    educationMatch: 'Needs Review',
    locationMatch: false,
  };

  const candidateSkills = (candidate.skills || []).map((s) => s.toLowerCase().trim());
  const jobSkills = (job.skills || []).map((s) => s.toLowerCase().trim());

  // 1. Skill Match (Weight: 50%)
  if (jobSkills.length > 0) {
    jobSkills.forEach((skill) => {
      if (candidateSkills.some((cs) => cs.includes(skill) || skill.includes(cs))) {
        breakdown.matchedSkills.push(skill);
      } else {
        breakdown.missingSkills.push(skill);
      }
    });
    const skillRatio = breakdown.matchedSkills.length / jobSkills.length;
    score += skillRatio * 50;
  } else {
    score += 50; // default full skill match if no specific skills listed
  }

  // 2. Experience Match (Weight: 25%)
  const candExp = String(candidate.experience || '').toLowerCase();
  const reqExp = String(job.experience || '').toLowerCase();

  // Extract numbers if present
  const candExpYears = parseFloat(candExp) || 0;
  const reqExpYears = parseFloat(reqExp) || 0;

  if (candExpYears >= reqExpYears && reqExpYears > 0) {
    score += 25;
    breakdown.experienceMatch = 'Strong Match';
  } else if (candExpYears > 0 || candExp.includes('entry') || candExp.includes('junior')) {
    score += 15;
    breakdown.experienceMatch = 'Partial Match';
  } else {
    score += 10;
    breakdown.experienceMatch = 'Basic Match';
  }

  // 3. Education Match (Weight: 15%)
  const candEdu = `${candidate.education || ''} ${candidate.degree || ''} ${candidate.college || ''}`.toLowerCase();
  const reqEdu = String(job.education || '').toLowerCase();

  if (candEdu.trim() && reqEdu && (candEdu.includes(reqEdu) || reqEdu.includes(candEdu.trim()) || candEdu.includes('degree') || candEdu.includes('bachelor') || candEdu.includes('master') || candEdu.includes('phd'))) {
    score += 15;
    breakdown.educationMatch = 'Strong Match';
  } else {
    score += 8;
    breakdown.educationMatch = 'Standard Match';
  }

  // 4. Location Match (Weight: 10%)
  const candLoc = String(candidate.location || '').toLowerCase();
  const jobLoc = String(job.location || '').toLowerCase();

  if (jobLoc.includes('remote') || candLoc.includes('remote') || (candLoc && jobLoc && candLoc.includes(jobLoc))) {
    score += 10;
    breakdown.locationMatch = true;
  } else if (candLoc && jobLoc) {
    score += 5;
    breakdown.locationMatch = false;
  } else {
    score += 5;
  }

  const finalScore = Math.min(100, Math.round(score));

  return {
    matchScore: finalScore,
    breakdown,
  };
}

module.exports = { calculateMatchScore };
