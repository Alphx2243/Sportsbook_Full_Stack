"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/lib/auth";
import service from "@/lib/service";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useSport } from "@/contexts/SportsContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const levels = ["Beginner", "Intermediate", "Expert"];

export default function AuthPage() {
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const { sports, setSports } = useSport();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "",
    password: "", phoneNumber: "",
    rollNumber: "", sportsExperience: [],
  });
  const { login, logout, loading, setUser, setLoading } = useAuth();
  const [sportsOptions, setSportsOptions] = useState([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [userLS, setUserLS] = useState(null);
  useEffect(() => {
    setMounted(true);
    setUserLS(user);
  }, []);
  useEffect(() => {
    if (userLS !== null) { router.push("/dashboard"); }
  }, [userLS, user, router]);

  useEffect(() => {
    async function fetchSports() {
      try {
        if (sports && sports.length > 0) { return; }
        const res = await service.getSports();
        const docs = res.documents || [];
        setSports(docs);
      }
      catch (err) {
        console.log(err);
      }
    }
    if (mounted) fetchSports();
  }, [mounted]);

  useEffect(() => {
    if (sports) {
      setSportsOptions(sports.map((s) => s.name));
    }
  }, [sports]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSportToggle = (sport) => {
    setFormData((prev) => {
      const exists = prev.sportsExperience.some((s) => s.startsWith(sport));
      if (exists) {
        return {
          ...prev,
          sportsExperience: prev.sportsExperience.filter(
            (s) => !s.startsWith(sport)
          ),
        };
      }
      return {
        ...prev,
        sportsExperience: [...prev.sportsExperience, `${sport}:Beginner`],
      };
    });
  };

  const handleLevelChange = (sport, level) => {
    setFormData((prev) => ({
      ...prev,
      sportsExperience: prev.sportsExperience.map((s) =>
        s.startsWith(sport) ? `${sport}:${level}` : s
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        name, email,
        password, phoneNumber,
        rollNumber, sportsExperience,
      } = formData;

      if (!email.endsWith("@iiitd.ac.in")) {
        showToast({ message: 'Only IIITD emails are allowed', type: 'warning' }); return;
      }

      if (!email || !password) {
        showToast({ message: 'Enter all details', type: 'warning' }); return;
      }

      if (isLogin) {
        try {
          await login(email, password);
          await showToast({
            message: 'Login Successful',
            type: 'success', autoClose: 2000,
          });

          router.push('/dashboard');
        }
        catch (err) {
          console.error("Login failed:", err);
          showToast({ message: 'Invalid Email/Password', type: 'error' });
        }
      }
      else {
        try {
          await authService.createAccount({
            email, password,
            name, phoneNumber,
            rollNumber, sportsExperience,
          });

          await login(email, password);
          await showToast({
            message: 'Account created and logged in!',
            type: 'success', autoClose: 2000,
          });
          router.push('/dashboard');
        }
        catch (err) {
          console.error("Signup or login failed:", err);
          showToast({ message: 'Signup failed. Try again.', type: 'error' });
        }
      }
    }
    catch (err) {
      console.error("Unexpected error:", err);
      showToast({ message: 'Something went wrong', type: 'error' });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden pt-16">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-white/10 shadow-2xl bg-card/40 backdrop-blur-xl">
          <CardHeader className="text-center pb-8 border-b border-border/50">
            <CardTitle className="text-3xl md:text-4xl font-bold text-gradient-premium">
              {isLogin ? "Welcome Back" : "Join SportsBook"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Sign in to access your dashboard" : "Create an account to get started"}
            </p>
          </CardHeader>
          <CardContent className="p-8 md:p-12">
            <div className="flex justify-center mb-8 bg-accent/5 p-1 rounded-full w-fit mx-auto border border-border/50">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phoneNumber: "",
                    rollNumber: "",
                    sportsExperience: [],
                  });
                }}
                className={`px-8 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phoneNumber: "",
                    rollNumber: "",
                    sportsExperience: [],
                  });
                }}
                className={`px-8 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${!isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Signup
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 max-w-md mx-auto"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="student@iiitd.ac.in"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-6 text-lg font-bold"
                  >
                    Login
                  </Button>
                </motion.form>
              ) : (
                <SignupStepper
                  formData={formData}
                  setFormData={setFormData}
                  sportsOptions={sportsOptions}
                  levels={levels}
                  onSportToggle={handleSportToggle}
                  onLevelChange={handleLevelChange}
                  onSubmit={handleSubmit}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              )}
            </AnimatePresence>

            <p className="text-center text-muted-foreground mt-8 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors cursor-pointer"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function SignupStepper({
  formData,
  setFormData,
  sportsOptions,
  levels,
  onSportToggle,
  onLevelChange,
  onSubmit,
  showPassword,
  setShowPassword,
}) {
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleStepSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      next();
    } else {
      onSubmit(e);
    }
  };

  return (
    <motion.form
      key="signup-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleStepSubmit}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="flex justify-between mb-6 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= i ? 'bg-primary text-black border-primary' : 'bg-transparent text-gray-500 border-gray-700'}`}>
              {i}
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
            required
          />
          <Input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((p) => ({ ...p, phoneNumber: e.target.value }))
            }
            required
          />
          <Input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={(e) =>
              setFormData((p) => ({ ...p, rollNumber: e.target.value }))
            }
            required
          />
          <Button
            type="button"
            onClick={next}
            variant="primary"
            className="w-full"
          >
            Next Step
          </Button>
        </motion.div>
      )}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email (must be @iiitd.ac.in)"
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({ ...p, email: e.target.value }))
            }
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={prev}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={next}
              className="flex-1"
            >
              Next Step
            </Button>
          </div>
        </motion.div>
      )}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-sm text-gray-400 mb-2">Select your sports experience:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {sportsOptions.map((sport) => (
              <div
                key={sport}
                className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/5 rounded-lg hover:border-white/10 transition-colors"
              >
                <label className="flex-1 inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sportsExperience.some((s) =>
                      s.startsWith(sport)
                    )}
                    onChange={() => onSportToggle(sport)}
                    className="mr-3 w-4 h-4 accent-primary rounded bg-gray-700 border-gray-600 ring-offset-gray-800 focus:ring-primary"
                  />
                  <span className="text-gray-200">{sport}</span>
                </label>
                {formData.sportsExperience.some((s) => s.startsWith(sport)) && (
                  <select
                    value={
                      formData.sportsExperience
                        .find((s) => s.startsWith(sport))
                        .split(":")[1]
                    }
                    onChange={(e) => onLevelChange(sport, e.target.value)}
                    className="px-2 py-1 rounded border border-white/10 bg-black text-white text-xs focus:ring-1 focus:ring-primary outline-none"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={prev}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Create Account
            </Button>
          </div>
        </motion.div>
      )}
    </motion.form>
  );
}
