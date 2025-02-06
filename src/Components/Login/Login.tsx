import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { logIn } from "../../store/slices/auth/authSlice";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function Login() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [theUser, setTheUser] = useState<string>("admin"); // قيمة مبدئية
  const [progressLog, setProgressLog] = useState<boolean>(false);
  const [_, setCookies] = useCookies(["access_token"]);

  const [t] = useTranslation();
  const dispatch = useDispatch();

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setProgressLog(true);
    try {
      e.preventDefault();
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}v1/auth/dashboard/signin`,
        {
          email: userName,
          password: password,
        }
      );
      dispatch(logIn());
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      setProgressLog(false);
    } catch (error) {
      console.log(error);
      setProgressLog(false);
    }
  };

  useEffect(() => {
    document.title = t("logIn");
  }, [t]);

  return (
    <Box
      className="logImage"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "url('/path/to/your/background.jpg') no-repeat center center",
        backgroundSize: "cover",
      }}
    >
      <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <FontAwesomeIcon
                icon={faRightToBracket}
                size="2x"
                color="#00796b"
              />
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
                {t("Welcome")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("welcomeToTheDashboard")}
              </Typography>
            </Box>

            <form onSubmit={submit}>
              <TextField
                label={t("userName")}
                variant="outlined"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                label={t("password")}
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                required
              />

              {/* حقل اختيار نوع المستخدم */}
              {/* <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="user-select-label">{t("userType")}</InputLabel>
                <Select
                  labelId="user-select-label"
                  id="user-select"
                  value={theUser}
                  onChange={(e) => setTheUser(e.target.value)}
                  label={t("userType")}
                >
                  <MenuItem value="admin">{t("admin")}</MenuItem>
                  <MenuItem value="lawyers">{t("lawyers")}</MenuItem>
                  <MenuItem value="representatives">{t("representatives")}</MenuItem>
                </Select>
              </FormControl> */}

              {progressLog ? (
                <CircularProgress
                  size={24}
                  sx={{ display: "block", margin: "auto" }}
                />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {t("submit")}
                </Button>
              )}
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
