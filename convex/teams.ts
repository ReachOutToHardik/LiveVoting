import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all teams
export const getTeams = query({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    // Sort by order field in JavaScript
    return teams.sort((a, b) => a.order - b.order);
  },
});

// Get current team ID
export const getCurrentTeam = query({
  handler: async (ctx) => {
    const state = await ctx.db.query("state").first();
    return state?.currentTeamId || null;
  },
});

// Get event name
export const getEventName = query({
  handler: async (ctx) => {
    const state = await ctx.db.query("state").first();
    return state?.eventName || "Creators Tank";
  },
});

// Get event started state
export const getIsStarted = query({
  handler: async (ctx) => {
    const state = await ctx.db.query("state").first();
    return state?.isStarted || false;
  },
});

// Start event (admin)
export const startEvent = mutation({
  handler: async (ctx) => {
    const state = await ctx.db.query("state").first();
    if (state) {
      await ctx.db.patch(state._id, { isStarted: true });
    }
  },
});

// Reset event (admin)
export const resetEvent = mutation({
  handler: async (ctx) => {
    const state = await ctx.db.query("state").first();
    if (state) {
      await ctx.db.patch(state._id, { isStarted: false });
    }
  },
});

// Like a team
export const likeTeam = mutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");
    
    await ctx.db.patch(args.teamId, {
      likes: team.likes + 1,
    });
  },
});

// Set current team (admin only)
export const setCurrentTeam = mutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const state = await ctx.db.query("state").first();
    
    if (state) {
      await ctx.db.patch(state._id, {
        currentTeamId: args.teamId,
      });
    } else {
      await ctx.db.insert("state", {
        currentTeamId: args.teamId,
      });
    }
  },
});

// Initialize teams
export const initializeTeams = mutation({
  args: { teamNames: v.array(v.string()), eventName: v.string() },
  handler: async (ctx, args) => {
    // Clear existing data
    const existingTeams = await ctx.db.query("teams").collect();
    for (const team of existingTeams) {
      await ctx.db.delete(team._id);
    }
    
    // Insert new teams
    const teamIds = [];
    for (let i = 0; i < args.teamNames.length; i++) {
      const id = await ctx.db.insert("teams", {
        name: args.teamNames[i],
        likes: 0,
        order: i,
      });
      teamIds.push(id);
    }
    
    // Set first team as current and event name
    if (teamIds.length > 0) {
      const state = await ctx.db.query("state").first();
      if (state) {
        await ctx.db.patch(state._id, {
          currentTeamId: teamIds[0],
          eventName: args.eventName,
        });
      } else {
        await ctx.db.insert("state", {
          currentTeamId: teamIds[0],
          eventName: args.eventName,
        });
      }
    }
    
    return { success: true, count: teamIds.length };
  },
});

// Reset all likes
export const resetAllLikes = mutation({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    
    for (const team of teams) {
      await ctx.db.patch(team._id, {
        likes: 0,
      });
    }
    
    return { success: true, count: teams.length };
  },
});
