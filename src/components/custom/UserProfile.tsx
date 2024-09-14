import React from "react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
    profile: {
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
      whatsapp: string | null;
      company_name: string | null;
      avatar: string | null;
      biodata_company: string | null;
      jobdesk: string | null;
    };
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-2 text-xl font-semibold">Profil Pengguna</h2>
      <div className="flex items-center mb-4">
        <img
          src={user.profile.avatar || "/default-avatar.png"}
          alt={user.name}
          className="w-16 h-16 mr-4 rounded-full"
        />
        <div>
          <p className="font-bold">{user.name}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      </div>
      <div>
        <p>
          <strong>Nama Depan:</strong> {user.profile.first_name}
        </p>
        <p>
          <strong>Nama Belakang:</strong> {user.profile.last_name}
        </p>
        <p>
          <strong>Telepon:</strong> {user.profile.phone}
        </p>
        <p>
          <strong>WhatsApp:</strong> {user.profile.whatsapp}
        </p>
        <p>
          <strong>Perusahaan:</strong> {user.profile.company_name}
        </p>
        <p>
          <strong>Biodata Perusahaan:</strong> {user.profile.biodata_company}
        </p>
        <p>
          <strong>Jabatan:</strong> {user.profile.jobdesk}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
