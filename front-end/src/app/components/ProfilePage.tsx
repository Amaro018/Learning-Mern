"use client";
import Image from "next/image";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import * as userApi from "../network/notes_api";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProfilePage() {
  const { currentUser } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await userApi.sendEmail(name, email, message);
      alert("Email sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Profile Image */}
        <div className="">
          <Image
            src="/istockphoto-1682296067-612x612.jpg"
            alt="Profile"
            width={300}
            height={100}
            priority
            className="rounded-lg w-full h-auto shadow-xl"
          />
        </div>

        {/* Text Content */}
        <div className="text-center">
          <div className="flex flex-col gap-2">
            <p className="text-3xl sm:text-4xl font-bold">
              Hi, I&apos;m {currentUser?.username || "John Doe"}
            </p>
            <p className="text-xl sm:text-2xl">
              {currentUser?.userInformation?.about ||
                "An architect based in Albay, Philippines"}
            </p>
          </div>

          <div className="flex flex-col gap-2 justify-center mt-4">
            <div>
              <button>
                <XIcon
                  sx={{
                    fontSize: 40,
                    color: "blue",
                    "&:hover": { color: "darkblue" },
                  }}
                />
              </button>
              <button>
                <InstagramIcon
                  sx={{
                    fontSize: 40,
                    color: "blue",
                    "&:hover": { color: "darkblue" },
                  }}
                />
              </button>
              <button>
                <FacebookRoundedIcon
                  sx={{
                    fontSize: 40,
                    color: "blue",
                    "&:hover": { color: "darkblue" },
                  }}
                />
              </button>
            </div>

            <div>
              <button
                className="bg-slate-700 text-white p-4 rounded-xl hover:bg-slate-800"
                onClick={() => setIsOpen(true)}
              >
                contact me
              </button>
            </div>
            <Modal
              open={isOpen}
              onClose={() => setIsOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="flex flex-col gap-4">
                <p className="text-slate-700 text-lg font-bold text-center">
                  Reach me by sending an email
                </p>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Email"}
                </Button>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
