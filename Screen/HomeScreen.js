import { View, Text , StatusBar, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {theme, weatherImages} from "../index.js" ;
import {MagnifyingGlassIcon} from "react-native-heroicons/outline" ;
import { MapPinIcon , CalendarDaysIcon} from "react-native-heroicons/solid" ;
import {debounce} from "lodash"
import { fetchLocation, fetchWeatherForcast } from '../API/Weather.js';
import { getData, storeData } from '../Utils/AsyncStorage.js';


export default function HomeScreen() {

  // For Control Search
  const [showSearch, toggleSearch] = useState(false) ;

  // For Control Location
  const [loc , setLocation] =useState([]) ; 

  // For Store Weather 
  const [weather , setWeather] = useState({}) ; 

  // For Loadding Data 
  const [loadding , setLoading] = useState(true) ; 

  // For Handle Location
  const handleLocation = (item)=>{
    setLocation([]); 
    setLoading(true)
    fetchWeatherForcast({
      cityName : item.name , 
      days : "7"
    }).then((data)=>{
        setWeather(data) ; 
        setLoading(false)
        storeData("city" , item.name)
        
    })
  }

  const {location , current} = weather ; 






  // For Handle Search 
  const handleSearch = (params)=>{
    if(params.length > 2){
      //*** Done */
      fetchLocation({cityName : params}).then((data)=>{
        setLocation(data) ; 
        
      })
    }
  }

  // For Handle Change In Search Text
  const handleTextDebounce = useCallback(debounce(handleSearch,1200) , []) ;

  // For Get The Data When open app
  useEffect(()=>{
    fetchMyWeatherData(); 
    
  } , [])

  const fetchMyWeatherData = async()=>{
    let myCity = await getData('city') ;
    let cityName = "Cairo" ; 
    if(myCity){
      cityName= myCity 
    } 
    fetchWeatherForcast({
      cityName 
    }).then((data)=>{
      setWeather(data) ; 
      setLoading(false)
    })
  }
 


 


  return (
    
        <KeyboardAvoidingView   enabled={false} className='flex-1 relative'>
        <StatusBar style="light" />
        <Text>sdfsd</Text>
        <Image blurRadius={70}  
        className="w-full h-full absolute" 
        source={require("./../assets/images/bg.png")} />

        {
          loadding ? (
            <View className="flex-1 flex-row justify-center items-center">
              <ActivityIndicator size={120} ></ActivityIndicator>
            </View>) :
             (
            <SafeAreaView className="flex flex-1">
          {/* Search Section */}
          <View className="mx-4 relative z-50" style={{height : '7%'}}>
            <View className='flex-row justify-end items-center rounded-full' style={{backgroundColor: showSearch? theme.bgWhite(0.2) : 1 }}>
              {
                showSearch ? (
                  <TextInput onChangeText={handleTextDebounce} className="pl-6 flex-1 h-10 text-base text-white" placeholder='Search city' placeholderTextColor={"lightgray"} />
                ) : null
              }
              <TouchableOpacity onPress={()=>toggleSearch(!showSearch)} style={{backgroundColor : theme.bgWhite(0.3)}} className='rounded-full p-2 m-1' >
                <MagnifyingGlassIcon size={25} color={"white"} />
              </TouchableOpacity>
            </View>
            {
              loc.length > 0 && showSearch ? (
                <View className="bg-gray-300 top-16 absolute w-full rounded-3xl">
                {
                  loc.map((item, idx)=>{
                    let showBorder = idx + 1 != loc.length ; 
                    let borderClass = showBorder ? 'border-b-2  border-b-gray-400' : '' ; 
                    return (
                      <TouchableOpacity
                      onPress={()=>handleLocation(item)}
                      key={idx}
                      className={`flex-1 flex-row border-0 items-center p-3 px-4 mb-1  ${borderClass}`} 
                      >
                        <MapPinIcon size={20} color={"gray"} />
                        <Text className="text-black text-lg ml-2" >{item?.name}, {item?.country}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
                </View>
              ): null
            }
          </View>
          {/* Forcast section */}
          <View className="mx-4 justify-around flex-1 mb-2">
            {/* Location */}
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name},
              <Text className="font-semibold text-gray-400 text-lg"> {location?.country}</Text>
            </Text>
            {/* Weather Image */}
            <View className="justify-center flex-row">
              <Image source={weatherImages[current?.condition?.text]}
              className="w-52 h-52"
              />
              
            </View>
              {/* Degree Celicus */}
              <View className="space-y-2">
                <Text className="text-center font-bold text-white text-6xl ml-5">{current?.temp_c}&#176;</Text>
                <Text className="text-center tracking-widest text-white text-xl ml-5">{current?.condition?.text}</Text>
              </View>
            {/* Other State */}
            <View className="flex-row justify-between mx-4">

              <View className="flex-row space-x-2 items-center">
                <Image className="w-6 h-6" source={require("../assets/icons/wind.png")} />
                <Text className=" font-semibold text-base text-white">{current?.wind_kph} km</Text>
              </View>

              <View className="flex-row space-x-2 items-center">
                <Image className="w-6 h-6" source={require("../assets/icons/drop.png")} />
                <Text className=" font-semibold text-base text-white">{current?.humidity}%</Text>
              </View>

              <View className="flex-row space-x-2 items-center">
                <Image className="w-6 h-6" source={require("../assets/icons/sun.png")} />
                <Text className=" font-semibold text-base text-white">{location?.localtime.slice(11 )}</Text>
              </View>
              
            </View>
          </View>
          {/* Forcast For The Next Day */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size={20} color={"white"} />
              <Text className="text-white text-base" >Daily Forcast</Text>
            </View>
            <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal : 15}}
            showsHorizontalScrollIndicator={false}
            >
                {
                  weather?.forecast?.forecastday?.map((item , idx)=>{
                    let date = new Date(item.date) ; 
                    let option = {weekday : "long"} ; 
                    let dayName = date.toLocaleDateString("en-US" , option) ; 
                    return (
                      <View key={idx} className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4" style={{backgroundColor : theme.bgWhite(.15)}}>
                        <Image source={{ uri :`http://${item?.day?.condition?.icon} `}} className="w-11 h-11" />
                        <Text className='text-white'>{dayName}</Text>
                        <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                      </View>
                    )
                  })
                }
             


            </ScrollView>
          </View>
        </SafeAreaView>
          )
        }
        

        </KeyboardAvoidingView>
    
  )
} ;