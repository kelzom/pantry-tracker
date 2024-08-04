
'use client'
import { Box, Typography, Stack, TextField, Button, Modal } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  backgroundImage: 'url(/coverpic.jpg)', 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

export default function LoginPage({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box sx={style}>
        <Typography id="login-modal-title" variant="h6" component="h2">
          Login
        </Typography>
        <Stack spacing={2}>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" onClick={onClose} sx={{ bgcolor: 'black', color: 'white' }}>
            Login
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
