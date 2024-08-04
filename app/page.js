'use client'
import { useState, useRef, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from '@mui/material'
import { firestore, storage } from '@/firebase'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import DeleteIcon from '@mui/icons-material/Delete'
import LoginPage from './loginpage'  

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(255, 255, 255, 0.8)', 
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [image, setImage] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    if (isLoggedIn) {
      updateInventory()
    }
  }, [isLoggedIn])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleLoginOpen = () => setLoginOpen(true)
  const handleLoginClose = () => {
    setLoginOpen(false)
    setIsLoggedIn(true) 
  }
  const handleImageModalOpen = () => setImageModalOpen(true)
  const handleImageModalClose = () => setImageModalOpen(false)
  const handleLogout = () => setIsLoggedIn(false) 

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoRef.current.srcObject = stream
  }

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d')
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasRef.current.toBlob((blob) => {
      setImage(blob)
    })
  }

  const uploadImage = async () => {
    if (!image) return
    const storageRef = ref(storage, `images/${Date.now()}.jpg`)
    await uploadBytes(storageRef, image)
    const url = await getDownloadURL(storageRef)
    console.log('Image URL:', url)
   
    await addDoc(collection(firestore, 'images'), { url })
    setImageModalOpen(false)
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      position="relative"
      sx={{
        backgroundColor: 'white', 
        backgroundImage: isLoggedIn ? 'none' : 'url(/coverpic.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Right Corner Buttons */}
      {!isLoggedIn && (
        <Box
          position="absolute"
          top={16}
          right={16}
          display="flex"
          gap={2}
        >
          <Button
            variant="contained"
            onClick={handleLoginOpen}
            sx={{
              bgcolor: 'white',
              color: 'black',
              borderRadius: '20px',
              fontSize: '0.75rem',
              padding: '6px 12px',
              border: '1px solid black',
            }}
          >
            Login as User
          </Button>
          <Button
            variant="contained"
            onClick={handleLoginOpen}
            sx={{
              bgcolor: 'white',
              color: 'black',
              borderRadius: '20px',
              fontSize: '0.75rem',
              padding: '6px 12px',
              border: '1px solid black',
            }}
          >
            Login as Guest
          </Button>
        </Box>
      )}
      {isLoggedIn && (
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          padding={2}
        >
          <Box width="30%" display="flex" flexDirection="column" gap={2} padding={2}>
            <Box marginBottom={2}>
              <Typography variant="h3" fontWeight="bold" color={'black'}>
                Pantry Tracker
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={'black'}>
                From clutter to clarity, we will track it all!
              </Typography>
            </Box>

            {/* Search Input Field */}
            <TextField
              label="Search Items"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            {/* Updated Inventory Box */}
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              marginBottom={2}
            >
              <Stack direction="row" spacing={2} marginBottom={2}>
                <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: 'black', color: 'white' }}>
                  Add New Item
                </Button>
                <Button variant="contained" onClick={handleImageModalOpen} sx={{ bgcolor: 'black', color: 'white' }}>
                  Capture Image
                </Button>
              </Stack>
              <Box border={'1px solid #333'} width="100%">
                <Box
                  width="100%"
                  height="60px"
                  bgcolor={'#ADD8E6'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
                    Inventory Items
                  </Typography>
                </Box>
                <Stack width="100%" height="350px" spacing={2} overflow={'auto'}>
                  {filteredInventory.map(({ name, quantity }) => (
                    <Box
                      key={name}
                      width="100%"
                      minHeight="100px"
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      bgcolor={'#f0f0f0'}
                      paddingX={3}
                    >
                      <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                      <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                        Quantity: {quantity}
                      </Typography>
                      <IconButton onClick={() => removeItem(name)} sx={{ color: 'red' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Logout Button */}
            <Box 
              paddingTop={2} 
              alignSelf="center" 
              marginTop="auto"
              position="relative"
            >
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  borderRadius: '8px',
                  width: '120px',
                  height: '40px',
                  fontSize: '0.75rem',
                  border: '1px solid black',
                  textAlign: 'center',
                  position: 'absolute',
                  bottom: '10px',
                  left: 'calc(50% - 60px)',
                  transform: 'translateX(-10%)',
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          {/* Image Section */}
          <Box width="70%" display="flex" justifyContent="center" alignItems="center">
            <Box
              component="img"
              src="/pantry-labeled-jars-.jpg"  
              alt="Pantry"
              sx={{ width: '1000px', height: '800px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </Box>
        </Box>
      )}

      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-item-modal-title"
        aria-describedby="add-item-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-item-modal-title" variant="h6" component="h2" sx={{ color: 'black' }}>
            Add New Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }
              }}
              sx={{ bgcolor: 'black', color: 'white' }}
            >
              Add
            </Button>
            <Button variant="contained" onClick={handleClose} sx={{ bgcolor: 'blue', color: 'white' }}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Capture Image Modal */}
      <Modal
        open={imageModalOpen}
        onClose={handleImageModalClose}
        aria-labelledby="capture-image-modal-title"
        aria-describedby="capture-image-modal-description"
      >
        <Box sx={style}>
          <Typography id="capture-image-modal-title" variant="h6" component="h2" sx={{ color: 'black' }}>
            Capture Image
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <video ref={videoRef} width="100%" height="auto" autoPlay />
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
            <Stack direction="row" spacing={2} marginTop={2}>
              <Button variant="contained" onClick={startCamera} sx={{ bgcolor: 'black', color: 'white' }}>
                Start Camera
              </Button>
              <Button variant="contained" onClick={captureImage} sx={{ bgcolor: 'black', color: 'white' }}>
                Capture
              </Button>
              <Button variant="contained" onClick={uploadImage} sx={{ bgcolor: 'black', color: 'white' }}>
                Upload
              </Button>
              <Button variant="contained" onClick={handleImageModalClose}>
                Close
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>

      <LoginPage open={loginOpen} onClose={handleLoginClose} />
    </Box>
  )
}
