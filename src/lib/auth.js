import { createAccount, login, logout, getCurrentUser } from '@/actions/auth'

export class AuthService {

  async createAccount({ email, password, name, phoneNumber, rollNumber, sportsExperience }) {
    const sportList = Array.isArray(sportsExperience)
      ? sportsExperience : sportsExperience?.split(",").map(s => s.trim()).filter(Boolean) || [];

    const qrText = `Email: ${email}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`;

    let qrCodePath = null;
    try {
      const qrResponse = await fetch(qrUrl);
      if (qrResponse.ok) {
        const qrBlob = await qrResponse.blob();
        const qrFile = new File([qrBlob], `${rollNumber}_qr.png`, { type: "image/png" });
        const formData = new FormData();
        formData.append('file', qrFile);

        const { uploadFile } = await import('@/actions/files');
        const uploaded = await uploadFile(formData);
        if (uploaded) { qrCodePath = uploaded.url; }
      }
    }
    catch (e) {
      console.error("QR Code generation failed", e);
    }

    const result = await createAccount({
      email, password,
      name, phone: phoneNumber,
      rollNumber, sportsExperience: sportList,
      qrCodePath
    })
    if (!result.success) { throw new Error(result.error) }
    return result.user
  }

  async updateProfile({ name }) { return true }

  async login({ email, password }) {
    const result = await login({ email, password })
    if (!result.success) { throw new Error(result.error) }
    return result.user
  }

  async getCurrentUser() { return await getCurrentUser() }

  async logout() { return await logout() }
}
const authService = new AuthService();
export default authService;

