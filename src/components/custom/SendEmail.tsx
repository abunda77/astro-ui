import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const SendEmail = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    // console.log("handleSubmit called"); // Tambahkan ini
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phoneNumber, email, message }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Sukses",
          description: "Email berhasil dikirim",
        });
        // Reset form fields after successful submission
        setName("");
        setPhoneNumber("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(result.error || "Gagal mengirim email");
      }
    } catch (error) {
      console.error("Error saat mengirim email:", error);
      toast({
        title: "Error",
        description: "Gagal mengirim email. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          type="text"
          placeholder="Masukan Nama Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Nomor WhatsApp</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Masukan No WA Aktif Anda"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Masukan Email Aktif Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="message">Pesan</Label>
        <Textarea
          id="message"
          placeholder="Tulis pesan Anda di sini"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          KIRIM PESAN
        </button>
      </div>
    </form>
  );
};

export default SendEmail;
