/**
 * Username validation helper.
 * Rules:
 * 1. Must be alphabets (a-z, A-Z), numbers (0-9), and @, #, $, _ signs.
 * 2. Strictly no spaces allowed.
 * 3. Length between 2 and 30 characters.
 */
export function validateUsername(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "নাম দেওয়া বাধ্যতামূলক" };
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "নাম খালি রাখা যাবে না" };
  }

  if (/\s/.test(name)) {
    return { valid: false, error: "নামে কোনো ফাঁকা জায়গা (space) দেওয়া যাবে না" };
  }

  if (name.length < 2) {
    return { valid: false, error: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" };
  }

  if (name.length > 30) {
    return { valid: false, error: "নাম সর্বোচ্চ ৩০ অক্ষরের হতে পারে" };
  }

  // Strictly forbid "niloy" or any case-insensitive combination or substring
  if (/niloy/i.test(name)) {
    return {
      valid: false,
      error: "এই নামটি বা 'niloy' শব্দটি নামে ব্যবহার করা নিষিদ্ধ",
    };
  }

  // Regex matching English letters, digits, and @, #, $, _
  const validPattern = /^[a-zA-Z0-9@#$_]+$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: "নামে শুধু ইংরেজি বর্ণ, সংখ্যা এবং @, #, $ চিহ্ন ব্যবহার করা যাবে",
    };
  }

  return { valid: true };
}
