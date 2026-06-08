import { redisClient } from "../db/redis.js";
import crypto from "crypto";
export interface OTP {
  otp: string;
  attempts: string;
  createdAt: string;
  lastAttemptAt: string;
  username?: string;
}

interface VerifyOTPResponse {
  success: boolean;
  username: string;
}

class OtpService {
  private redisClient = redisClient;
  private otpExpiry = 5 * 60;
  async setOTP(email: string, username: string): Promise<number> {
    const OTP = crypto.randomInt(100000, 999999);

    await this.redisClient.hset(`otp:${email}`, {
      otp: OTP,
      attempts: 0,
      username: username,
    });
    await this.redisClient.expire(`otp:${email}`, this.otpExpiry);

    return OTP;
  }

  async verifyOTP(email: string, otp: number): Promise<VerifyOTPResponse> {
    const OtpData = await this.redisClient.hgetall(`otp:${email}`);

    if (parseInt(OtpData.otp as string) !== otp) {
      return { success: false, username: "" };
    }

    await this.redisClient.del(`otp:${email}`);
    return { success: true, username: OtpData.username! };
  }
}

const otpService = new OtpService();

export default otpService;
