import { describe, it, expect, beforeEach } from "vitest";
import { validateUsername } from "@/lib/validation/username";
import { createUser, findUser, recordBurn, getLeaderboard } from "@/lib/db/database";

describe("Username Validation", () => {
  it("rejects empty or whitespace-only names", () => {
    expect(validateUsername("").valid).toBe(false);
    expect(validateUsername("   ").valid).toBe(false);
  });

  it("rejects names with spaces", () => {
    expect(validateUsername("Safkat Niloy").valid).toBe(false);
    expect(validateUsername("Habib Bhai$").valid).toBe(false);
  });

  it("rejects names with invalid characters like ! % ^ & * ( )", () => {
    expect(validateUsername("Safkat!").valid).toBe(false);
    expect(validateUsername("Smoker%1").valid).toBe(false);
    expect(validateUsername("User-Name").valid).toBe(false);
  });

  it("accepts valid names with letters, numbers, @, #, and $", () => {
    expect(validateUsername("Safkat@1").valid).toBe(true);
    expect(validateUsername("Benson#King").valid).toBe(true);
    expect(validateUsername("Dhaka$Smoker").valid).toBe(true);
    expect(validateUsername("Akash123").valid).toBe(true);
    expect(validateUsername("S@m#o$k").valid).toBe(true);
  });
});

describe("Database & Leaderboard", () => {
  const testUserName = `TestUser_${Date.now()}#$`;

  it("creates a new unique user", () => {
    const res = createUser(testUserName);
    expect(res.success).toBe(true);
    expect(res.user?.name).toBe(testUserName);
    expect(res.user?.totalBurnt).toBe(0);
  });

  it("rejects duplicate user creation with exact or case-insensitive name", () => {
    const duplicateRes = createUser(testUserName.toLowerCase());
    expect(duplicateRes.success).toBe(false);
    expect(duplicateRes.error).toContain("অলরেডি নেওয়া আছে");
  });

  it("records a burnt cigarette against user", () => {
    const burn = recordBurn({
      name: testUserName,
      brandId: "benson",
      brandName: "Benson & Hedges",
      draws: 7,
      durationSeconds: 45,
    });
    expect(burn.success).toBe(true);
    expect(burn.totalBurnt).toBe(1);

    const user = findUser(testUserName);
    expect(user?.totalBurnt).toBe(1);
    expect(user?.brandStats["benson"]).toBe(1);
  });

  it("returns leaderboard with ranks and top 1000", () => {
    const lb = getLeaderboard(1000, testUserName);
    expect(lb.topUsers.length).toBeGreaterThan(0);
    expect(lb.currentUser?.name).toBe(testUserName);
    expect(lb.topUsers[0].totalBurnt).toBeGreaterThanOrEqual(lb.topUsers[1]?.totalBurnt ?? 0);
  });
});

