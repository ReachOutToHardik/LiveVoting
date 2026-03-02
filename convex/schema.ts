import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
    likes: v.number(),
    order: v.number(),
  }),
  
  state: defineTable({
    currentTeamId: v.optional(v.id("teams")),
    eventName: v.optional(v.string()),
    isStarted: v.optional(v.boolean()),
  }),
});
