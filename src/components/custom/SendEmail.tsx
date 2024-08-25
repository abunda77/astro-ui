import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { RefreshCcw } from "lucide-react";

const SendEmail = () => {
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [noWa, setNoWa] = useState("");

  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    setCaptchaText(randomString);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userCaptcha !== captchaText) {
      toast({
        title: "Error",
        description: "Captcha salah. Silakan coba lagi.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult("Mohon tunggu...");

    const formData = {
      access_key: import.meta.env.PUBLIC_API_WEB3_KEY,
      subject,
      name,
      email,
      noWa,
      message,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (response.status === 200) {
        setResult(json.message);
        toast({
          title: "Sukses",
          description: json.message,
        });
        // Reset form fields after successful submission
        setName("");
        setEmail("");
        setMessage("");
      } else {
        console.log(response);
        setResult(json.message);
        toast({
          title: "Error",
          description: json.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saat mengirim email:", error);
      setResult("Terjadi kesalahan!");
      toast({
        title: "Error",
        description: "Gagal mengirim email. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setResult("");
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="hidden"
        id="subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      ></input>

      <div>
        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
          Nama
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Masukan Nama Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-gray-200 dark:text-gray-200"
        />
        <input
          type="hidden"
          name="from_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <div>
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
          Email
        </Label>
        <input id="email" type="email" value="erieputranto@gmail.com" hidden />
        <Input
          id="userEmail"
          type="email"
          placeholder="Masukan Email Aktif Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-200 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="noWa" className="text-gray-700 dark:text-gray-300">
          No. WhatsApp
        </Label>
        <Input
          id="noWa"
          type="text"
          placeholder="Masukan No. WhatsApp Anda"
          value={noWa}
          onChange={(e) => setNoWa(e.target.value)}
          className="bg-gray-200 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
          Pesan
        </Label>
        <Textarea
          id="message"
          placeholder="Tulis pesan Anda di sini"
          rows={4}
          className="bg-gray-200 dark:text-gray-200"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <div>
        <div className="flex items-center mb-4 space-x-4">
          <Label
            htmlFor="captcha"
            className="text-gray-700 dark:text-gray-300 whitespace-nowrap"
          >
            Captcha
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="captcha"
              type="text"
              placeholder="Masukkan captcha di atas"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              required
              className="max-w-xs text-gray-900 bg-white w-36 dark:bg-gray-600 dark:text-gray-100"
            />
            <div className="p-2 text-green-600 bg-gray-200 rounded dark:bg-gray-600 dark:text-green-400">
              {captchaText}
            </div>
            <Button
              type="button"
              onClick={generateCaptcha}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-800"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          KIRIM PESAN
        </Button>
      </div>
      {result && <div id="result">{result}</div>}
    </form>
  );
};

export default SendEmail;
