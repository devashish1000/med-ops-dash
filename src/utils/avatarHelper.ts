import maleProfessional1 from "@/assets/avatars/male-professional-1.jpg";
import femaleProfessional1 from "@/assets/avatars/female-professional-1.jpg";
import maleProfessional2 from "@/assets/avatars/male-professional-2.jpg";
import femaleProfessional2 from "@/assets/avatars/female-professional-2.jpg";

// Common male and female names for detection
const commonMaleNames = [
  'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph',
  'thomas', 'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'mark',
  'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian',
  'george', 'timothy', 'ronald', 'edward', 'jason', 'jeffrey', 'ryan', 'jacob',
  'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott',
  'brandon', 'benjamin', 'samuel', 'raymond', 'patrick', 'alexander', 'jack',
  'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam', 'nathan', 'douglas',
  'zachary', 'peter', 'kyle', 'walter', 'ethan', 'jeremy', 'harold', 'keith',
  'christian', 'roger', 'noah', 'gerald', 'carl', 'terry', 'sean', 'austin',
  'arthur', 'lawrence', 'jesse', 'dylan', 'bryan', 'joe', 'jordan', 'billy',
  'bruce', 'albert', 'willie', 'gabriel', 'logan', 'alan', 'juan', 'wayne',
  'elijah', 'randy', 'roy', 'vincent', 'ralph', 'eugene', 'russell', 'bobby',
  'mason', 'philip', 'louis'
];

const commonFemaleNames = [
  'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth', 'susan',
  'jessica', 'sarah', 'karen', 'lisa', 'nancy', 'betty', 'margaret', 'sandra',
  'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'carol', 'amanda', 'dorothy',
  'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon', 'laura', 'cynthia',
  'kathleen', 'amy', 'angela', 'shirley', 'anna', 'brenda', 'pamela', 'emma',
  'nicole', 'helen', 'samantha', 'katherine', 'christine', 'debra', 'rachel',
  'carolyn', 'janet', 'catherine', 'maria', 'heather', 'diane', 'ruth', 'julie',
  'olivia', 'joyce', 'virginia', 'victoria', 'kelly', 'lauren', 'christina',
  'joan', 'evelyn', 'judith', 'megan', 'andrea', 'cheryl', 'hannah', 'jacqueline',
  'martha', 'gloria', 'teresa', 'ann', 'sara', 'madison', 'frances', 'kathryn',
  'janice', 'jean', 'abigail', 'alice', 'judy', 'sophia', 'grace', 'denise',
  'amber', 'doris', 'marilyn', 'danielle', 'beverly', 'isabella', 'theresa',
  'diana', 'natalie', 'brittany', 'charlotte', 'marie', 'kayla', 'alexis',
  'lori'
];

/**
 * Analyzes the email username to determine likely gender
 * @param email - User's email address
 * @returns 'male' | 'female' | 'neutral'
 */
export function detectGenderFromEmail(email: string): 'male' | 'female' | 'neutral' {
  const username = email.split('@')[0].toLowerCase();
  
  // Extract first name if username contains separators
  const nameParts = username.split(/[._-]/);
  const firstName = nameParts[0];
  
  // Check against common names
  if (commonMaleNames.includes(firstName)) {
    return 'male';
  }
  
  if (commonFemaleNames.includes(firstName)) {
    return 'female';
  }
  
  // Check all parts of the username
  for (const part of nameParts) {
    if (commonMaleNames.includes(part)) {
      return 'male';
    }
    if (commonFemaleNames.includes(part)) {
      return 'female';
    }
  }
  
  // Default to neutral if can't determine
  return 'neutral';
}

/**
 * Gets an appropriate default avatar based on email
 * @param email - User's email address
 * @returns Avatar image URL
 */
export function getDefaultAvatar(email: string): string {
  const gender = detectGenderFromEmail(email);
  const username = email.split('@')[0].toLowerCase();
  
  // Use hash of username to consistently assign the same avatar to the same user
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (gender === 'male') {
    return hash % 2 === 0 ? maleProfessional1 : maleProfessional2;
  } else if (gender === 'female') {
    return hash % 2 === 0 ? femaleProfessional1 : femaleProfessional2;
  } else {
    // For neutral/unknown, alternate between male and female based on hash
    const avatars = [maleProfessional1, femaleProfessional1, maleProfessional2, femaleProfessional2];
    return avatars[hash % avatars.length];
  }
}
