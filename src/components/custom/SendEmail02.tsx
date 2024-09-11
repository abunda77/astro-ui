import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const SendEmail = () => {
  const [subject] = useState("Pesan Pengunjung");
  const [name, setName] = useState("");
  const [toName] = useState("Admin Bosqu");
  const [toEmail] = useState("erieputranto@gmail.com");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [noWa, setNoWa] = useState("");
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [showForm, setShowForm] = useState(true);

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
      setAlertStatus("error");
      return;
    }

    setIsLoading(true);
    setResult("Mohon tunggu...");

    const formData = {
      access_key: import.meta.env.PUBLIC_APIKEY_BREVO,
      sender: {
        email: import.meta.env.PUBLIC_MAIL_FROM_ADDRESS,
        name: name,
      },
      to: [
        {
          name: toName,
          email: toEmail,
        },
      ],
      replyTo: {
        email: email,
      },
      subject,
      htmlContent: `<p><strong>Nama:</strong> ${name}</p>
                  <p><strong>Nomor WhatsApp:</strong> ${noWa}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Pesan:</strong> ${message}</p>`,
    };

    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_URL_BREVO}/v3/smtp/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": import.meta.env.PUBLIC_APIKEY_BREVO,
          },
          body: JSON.stringify(formData),
        }
      );

      const json = await response.json();

      if (response.status === 200 || response.status === 201) {
        setResult(json.message);
        toast({
          title: "Sukses",
          description: "Pesan berhasil terkirim",
        });
        setAlertStatus("success");
        setShowForm(false);
        // Reset form fields after successful submission
        setName("");
        setEmail("");
        setMessage("");
      } else {
        console.log(response);
        setResult(json.message);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat mengirim pesan",
          variant: "destructive",
        });
        setAlertStatus("error");
      }
    } catch (error) {
      console.error("Error saat mengirim email:", error);
      setResult("Terjadi kesalahan!");
      toast({
        title: "Error",
        description: "Gagal mengirim email. Silakan coba lagi.",
        variant: "destructive",
      });
      setAlertStatus("error");
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setResult("");
        setAlertStatus(null);
      }, 10000);
    }
  };

  return (
    <>
      {alertStatus === "success" && (
        <Alert className="mb-4 bg-green-200 dark:bg-green-200">
          <Terminal className="w-4 h-4" />
          <AlertTitle>Sukses!</AlertTitle>
          <AlertDescription>
            Pesan Anda berhasil terkirim. Terima kasih telah menghubungi kami.
          </AlertDescription>
        </Alert>
      )}
      {alertStatus === "error" && (
        <Alert variant="destructive" className="mb-4">
          <Terminal className="w-4 h-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.
          </AlertDescription>
        </Alert>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <input
              id="email"
              type="email"
              value="erieputranto@gmail.com"
              hidden
            />
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
            <Label
              htmlFor="message"
              className="text-gray-700 dark:text-gray-300"
            >
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
            <div className="flex flex-col mb-4 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <Label
                htmlFor="captcha"
                className="text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >
                Captcha
              </Label>
              <div className="flex flex-col items-start w-full space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 sm:w-auto">
                <Input
                  id="captcha"
                  type="text"
                  placeholder="Masukkan captcha di atas"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  required
                  className="w-full text-gray-900 bg-white sm:w-36 dark:bg-gray-600 dark:text-gray-100"
                />
                <div className="flex items-center space-x-2">
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
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              KIRIM PESAN
            </Button>
          </div>
          {result && <div id="result">{result}</div>}
        </form>
      )}
    </>
  );
};
export default SendEmail;
// update Sendmail 25/08
