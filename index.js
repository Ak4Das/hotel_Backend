const express = require("express")
const app = express()

const { initializeDatabase } = require("./db/db.connect")
const Hotel = require("./models/hotel.models")

app.use(express.json())

initializeDatabase()

// cors
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// const newHotel = {
//   name: "Sunset Resort",
//   category: "Resort",
//   location: "12 Main Road, Anytown",
//   rating: 4.0,
//   reviews: [],
//   website: "https://sunset-example.com",
//   phoneNumber: "+1299655890",
//   checkInTime: "2:00 PM",
//   checkOutTime: "11:00 AM",
//   amenities: [
//     "Room Service",
//     "Horse riding",
//     "Boating",
//     "Kids Play Area",
//     "Bar",
//   ],
//   priceRange: "$$$$ (61+)",
//   reservationsNeeded: true,
//   isParkingAvailable: true,
//   isWifiAvailable: true,
//   isPoolAvailable: true,
//   isSpaAvailable: true,
//   isRestaurantAvailable: true,
//   photos: [
//     "https://example.com/hotel2-photo1.jpg",
//     "https://example.com/hotel2-photo2.jpg",
//   ],
// }

// async function createHotel(newHotel) {
//   try {
//     const hotel = new Hotel(newHotel)
//     const saveHotel = await hotel.save()
//     return saveHotel
//   } catch (error) {
//     throw error
//   }
// }

// // createHotel(newHotel)

// app.post("/hotels", async (req, res) => {
//   try {
//     const savedHotel = await createHotel(req.body)
//     res
//       .status(201)
//       .json({ message: "Hotel added successfully", Hotel: savedHotel })
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add Hotel" })
//   }
// })

async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
    return deletedHotel
  } catch (error) {
    throw error
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId)
    res
      .status(200)
      .json({
        error: "Hotel deleted successfully.",
        deletedHotel: deletedHotel,
      })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel. " })
  }
})

async function updateHotel(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      dataToUpdate,
      {
        new: true,
      }
    )
    return updatedHotel
  } catch (error) {
    console.log("Error in updating Hotel", error)
  }
}

app.post("/hotel/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotel(
      req.params.hotelId,
      req.body
    )
    if (updatedHotel) {
      res.status(200).json({ message: "hotel updated Successfully" })
    } else {
      res.status(404).json({ error: "hotel not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update hotel." })
  }
})

// read all the hotels from the database
async function readAllHotels() {
  try{
    const allHotels = await Hotel.find()
    return allHotels
  } catch (error) {
    throw error
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels()
    if (hotels.length !== 0) {
      res.json(hotels)
    } else {
      res.status(404).json({ error: "no hotel found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch hotels." })
  }
})

// find a hotel with a particular name
async function readHotelByName (hotelName) {
  try{
    const hotel = await Hotel.findOne ({name:hotelName})
    return hotel
  } catch (error) {
    throw error
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName (req.params.hotelName)
    if (hotel) {
      res.json(hotel)
    } else {
      res.status(404).json({ error: "hotel not found with this name." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch hotel with this name." })
  }
})

// Add a Hotel in the database
async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel)
    const saveHotel = await hotel.save()
    return saveHotel
  } catch (error) {
    throw error
  }
}

app.post("/addHotel", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body)
    res
      .status(201)
      .json({ message: "hotel added successfully", hotel: savedHotel })
  } catch (error) {
    res.status(500).json({ error: "Failed to add hotel" })
  }
})

// // find a hotel by phone number
// async function readHotelByPhoneNumber (phoneNumber) {
//   try{
//     const hotel = await Hotel.findOne ({phoneNumber:phoneNumber})
//     return hotel
//   } catch (error) {
//     throw error
//   }
// }

// app.get("/hotels/directory/:phoneNumber", async (req, res) => {
//   try {
//     const hotel = await readHotelByPhoneNumber (req.params.phoneNumber)
//     if (hotel) {
//       res.json(hotel)
//     } else {
//       res.status(404).json({ error: "hotel not found with this phone number." })
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to Fetch hotel with this phone number." })
//   }
// })

// // find a hotel by hotel rating
// async function readHotelByRating(hotelRating) {
//   try {
//     const hotel = await Hotel.findOne({ rating: hotelRating })
//     return hotel
//   } catch (error) {
//     throw error
//   }
// }

// app.get("/hotels/rating/:hotelRating", async (req, res) => {
//   try {
//     const hotel = await readHotelByRating(req.params.hotelRating)
//     if (hotel) {
//       res.json(hotel)
//     } else {
//       res.status(404).json({ error: "hotel not found." })
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to Fetch hotel." })
//   }
// })

// // find a hotel by hotel category
// async function readHotelByCategory(hotelCategory) {
//   try {
//     const hotel = await Hotel.findOne({ category: hotelCategory })
//     return hotel
//   } catch (error) {
//     throw error
//   }
// }

// app.get("/hotels/category/:hotelCategory", async (req, res) => {
//   try {
//     const hotel = await readHotelByCategory(req.params.hotelCategory)
//     if (hotel) {
//       res.json(hotel)
//     } else {
//       res.status(404).json({ error: "hotel not found with this category." })
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to Fetch hotel with this category." })
//   }
// })

const PORT = 3000
app.listen(PORT, () => {
  console.log("Server is running on ", PORT)
})

// // read all hotels
// async function readHotels() {
//   try {
//     const hotels = await Hotel.find()
//     console.log(hotels)
//   } catch (error) {
//     throw error
//   }
// }
// readHotels()

// // read a hotel by its name
// async function readHotelByName(hotelName) {
//   try {
//     const hotel = await Hotel.findOne({ name: hotelName })
//     console.log(hotel)
//   } catch (error) {
//     throw error
//   }
// }
// readHotelByName("Lake View")

// // read all hotels which offers parking space
// async function readHotelByParking(parking) {
//   try {
//     const hotel = await Hotel.find({
//       isParkingAvailable: parking,
//     })
//     console.log(hotel)
//   } catch (error) {
//     throw error
//   }
// }

// readHotelByParking(true)

// // read all hotels which has restaurant available
// async function readHotelByRestaurantAvailability(restaurant) {
//   try {
//     const hotel = await Hotel.find({
//       isRestaurantAvailable: restaurant,
//     })
//     console.log(hotel)
//   } catch (error) {
//     throw error
//   }
// }

// readHotelByRestaurantAvailability(true)

// // read all hotels by category
// async function readHotelByCategory(category) {
//   try {
//     const hotel = await Hotel.find({
//       category: category,
//     })
//     console.log(hotel)
//   } catch (error) {
//     throw error
//   }
// }

// readHotelByCategory("Mid-Range")

// // read all hotels by price range
// async function readHotelByRange(range) {
//   try {
//     const hotel = await Hotel.find({
//       priceRange: range,
//     })
//     console.log(hotel)
//   } catch (error) {
//     throw error
//   }
// }

// readHotelByRange("$$$$ (61+)")

// // read all hotels with 4.0 rating
// async function readHotelByRating(rating) {
//   try {
//     const hotel = await Hotel.find({
//       rating: rating,
//     })
//     console.log(hotel)
//   } catch (error) {
//     throw error
//   }
// }

// readHotelByRating(4.0)

// // read a hotel by phone number
// async function readHotelByPhoneNumber(phoneNumber) {
//   try {
//     const hotel = await Hotel.findOne({ phoneNumber: phoneNumber })
//     console.log(hotel)
//   } catch (error) {
//     throw error
//   }
// }

// readHotelByPhoneNumber("+1299655890")

// // find Hotel by id and update it
// async function updateHotel(hotelId, dataToUpdate) {
//   try {
//     const updatedHotel = await Hotel.findByIdAndUpdate(
//       hotelId,
//       dataToUpdate,
//       {
//         new: true,
//       }
//     )
//     console.log(updatedHotel)
//   } catch (error) {
//     throw error
//   }
// }
// updateHotel("68ef2bbcf4ca83996e767da5", { checkOutTime: "11:00 AM" })

// // find one hotel and update it
// async function updateHotel(hotelName, dataToUpdate) {
//   try {
//     const updatedHotel = await Hotel.findOneAndUpdate(
//       { name: hotelName },
//       dataToUpdate,
//       {
//         new: true,
//       }
//     )
//     console.log(updatedHotel)
//   } catch (error) {
//     throw error
//   }
// }
// updateHotel("Sunset Resort", { rating: 4.2 })

// // find one hotel and update it
// async function updateHotel(phoneNumber, dataToUpdate) {
//   try {
//     const updatedHotel = await Hotel.findOneAndUpdate(
//       {
//         phoneNumber: phoneNumber,
//       },
//       dataToUpdate,
//       {
//         new: true,
//       }
//     )
//     console.log(updatedHotel)
//   } catch (error) {
//     throw error
//   }
// }
// updateHotel("+1299655890", {
//   phoneNumber: "+1997687392",
// })

// // find Hotel by id and delete it from the database
// async function deleteHotelById(hotelId) {
//   try {
//     const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
//     console.log(deletedHotel)
//   } catch (error) {
//     throw error
//   }
// }
// deleteHotelById("68ecfbb59a5aa7eea66c5b4f")

// // find one hotel and delete it from the database
// async function deleteHotelByPhoneNumber(hotelPhoneNumber) {
//   try {
//     const deletedHotel = await Hotel.findOneAndDelete({
//       phoneNumber: hotelPhoneNumber,
//     })
//     console.log(deletedHotel)
//   } catch (error) {
//     throw error
//   }
// }
// deleteHotelByPhoneNumber("+1997687392")
