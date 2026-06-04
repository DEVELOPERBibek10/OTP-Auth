import { redisClient } from "../db/redis.js";
import crypto from "crypto";
export interface OTP {
  otp: string;
  attempts: string;
  createdAt: string;
  lastAttemptAt: string;
}

class OtpService {
  private redisClient = redisClient;
  private otpExpiry = 5 * 60;
  async setOTP(email: string): Promise<number> {
    const OTP = crypto.randomInt(100000, 999999);

    await this.redisClient.hset(`otp:${email}`, {
      otp: OTP,
      attempts: 0,
      createdAt: Date.now(),
      lastAttemptAt: Date.now(),
    });
    await this.redisClient.expire(`otp:${email}`, this.otpExpiry);

    return OTP;
  }

  async verifyOTP(email: string, otp: number): Promise<boolean> {
    const OtpData = await this.redisClient.hgetall(`otp:${email}`);

    if (parseInt(OtpData.otp as string) !== otp) {
      await this.redisClient.hincrby(`otp:${email}`, "attempts", 1);
      await this.redisClient.hset(`otp:${email}`, "lastAttemptAt", Date.now());
      return false;
    }

    await this.redisClient.del(`otp:${email}`);
    return true;
  }
}

const otpService = new OtpService();

export default otpService;
