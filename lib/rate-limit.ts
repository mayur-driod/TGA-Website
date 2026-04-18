import {Ratelimit} from "@upstash/ratelimit";
import {redis} from "./redis";

export const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
});