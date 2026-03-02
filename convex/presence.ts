import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Amount of time to consider a user "online" (e.g. 10 seconds)
const ONLINE_THRESHOLD = 10000;

export const heartbeat = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    // Clean up old presence entries occasionally (probabilistic cleanup)
    if (Math.random() < 0.1) {
      const oldPresence = await ctx.db
        .query("presence")
        .withIndex("by_updated", (q) => q.lt("updatedAt", now - ONLINE_THRESHOLD))
        .collect();
      for (const p of oldPresence) {
        await ctx.db.delete(p._id);
      }
    }

    // Insert new presence or update existing? 
    // For simplicity without auth, we just insert a new record for this session if we don't track ID.
    // However, to avoid explosion, let's just insert one and return an ID to reuse?
    // Or better: Just insert. Since we clean up old ones, "live users" is just count of recent records.
    // To prevent one user spanning multiple records, we really should track a session ID.
    // Let's assume the client sends a random session ID.
  },
});

export const updatePresence = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Find existing presence for this user
    // Note: In high scale this scan might be slow, but for 300 users it O(N) is fine, 
    // or we could index by user. Let's assume simple schema for now.
    // Actually, let's index by user to be safe if we want unique counts.
    // But schema change for index might be annoying.
    // Let's just blindly insert and cleanup for now? No, accurate count needs unique users.
    
    // Let's check if we have a record for this user recently?
    // Doing a scan for 300 items is instant.
    const existing = await ctx.db.query("presence")
        .filter(q => q.eq(q.field("user"), args.userId))
        .first();

    if (existing) {
        await ctx.db.patch(existing._id, { updatedAt: now });
    } else {
        await ctx.db.insert("presence", { user: args.userId, updatedAt: now });
    }
  },
});

export const getOnlineCount = query({
  handler: async (ctx) => {
    const now = Date.now();
    // Count records updated in last 10 seconds
    const active = await ctx.db
      .query("presence")
      .withIndex("by_updated", (q) => q.gt("updatedAt", now - ONLINE_THRESHOLD))
      .collect();
    return active.length;
  },
});
