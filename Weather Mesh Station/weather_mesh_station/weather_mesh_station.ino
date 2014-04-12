#include <Adafruit_CC3000.h>
#include <Adafruit_CC3000_Server.h>
#include <ccspi.h>
#include <SPI.h>
#include <avr-libc.h>
#include <Wire.h>
#include <string.h>
#include <Adafruit_MPL115A2.h>
#include "DHT.h"
#include <stdint.h>

//Digital Pin for DHT11
#define DHTPIN 2 
// Define CC3000 chip pins
#define ADAFRUIT_CC3000_IRQ   3
#define ADAFRUIT_CC3000_VBAT  5
#define ADAFRUIT_CC3000_CS    10

#define WLAN_SSID       "SpaceAppsTO-03"        // cannot be longer than 32 characters!
#define WLAN_PASS       "innovation"
#define WLAN_SECURITY   WLAN_SEC_WPA2
#define IDLE_TIMEOUT_MS  3000 

//Define which type of the DHT (eg DHT11, DHT22, DHT21)
#define DHTTYPE DHT11

//Create instance for the MP11, DHT11 and the CC300
Adafruit_MPL115A2 mpl115a2;
DHT dht(DHTPIN, DHTTYPE);
Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT,
                                         SPI_CLOCK_DIV2);
Adafruit_CC3000_Client client;

                                         
//Constant Variables for the API
uint32_t apiUrl = cc3000.IP2U32(192,168,103,41);
const unsigned long
dhcpTimeout     = 60L * 1000L, // Max time to wait for address from DHCP
connectTimeout  = 15L * 1000L, // Max time to wait for server connection
responseTimeout = 15L * 1000L; // Max time to wait for data from server
int port = 3000;

String urlEndpoint = "/hello/";

char tempC[6];
char rhPct[6];
uint32_t t;

void setup(void) 
{
  Serial.begin(115200);
  
  Serial.println("Starting Weather Station ...");
  // Initialise the CC3000 module
  while (!cc3000.begin())
  {

  }

 
  
  // Connect to  WiFi network
  if (!cc3000.connectToAP(WLAN_SSID, WLAN_PASS, WLAN_SECURITY)) {
    Serial.println(F("Failed!"));
    while(1);
  }
   
  Serial.println(F("Connected!"));
  
  /* Wait for DHCP to complete */
  Serial.println(F("Request DHCP"));
  while (!cc3000.checkDHCP())
  {
    delay(100); // ToDo: Insert a DHCP timeout!
  }  
  
  Serial.println("Connected to WiFi network!");
  
  //start the MPL11 and DHT11
  mpl115a2.begin();
  dht.begin();
 
}

void loop(void) 
{
  float pressure;
  float temp;
  float humidity = dht.readHumidity();
 
  pressure = mpl115a2.getPressure();  
  temp = mpl115a2.getTemperature();
  humidity = dht.readHumidity();  
  
  Serial.print("Pressure (kPa): ");
  Serial.print(pressure, 4);  
  Serial.println(" kPa");      
  
  Serial.print("Temp (*C): ");
  Serial.print(temp, 1);
  Serial.println(" *C");    
  
  Serial.print("Humdity: ");
  Serial.print(humidity);
  Serial.println(" %\t");
  
  
  dtostrf(temp, 2, 2, tempC);
  dtostrf(humidity, 1, 3, rhPct);

  // Send request
  String request = "GET "+ urlEndpoint + String(tempC) + "/" + String(rhPct) + " HTTP/1.0\r\nConnection: close\r\n\r\n";
  Serial.println(request);
  t = millis();
  do {
    client = cc3000.connectTCP(apiUrl, port);
  } 
  while((!client.connected()) &&
    ((millis() - t) < connectTimeout));
    
  if (client.connected()) {
    send_request(request);
  }
  else {
    Serial.println(F("Connection failed"));    
    return;
  }
  Serial.println("...Reading response");
  
  delay(10000);
}


// Function to send a TCP request and get the result as a string
boolean send_request (String request) {
  
  Serial.println("send_request");
  // Transform to char
  char requestBuf[request.length()+1];
  request.toCharArray(requestBuf, request.length()); 
  // Send request
  if (client.connected()) {
    client.fastrprintln(requestBuf); 
  } 
  else {
    Serial.println(F("Connection failed"));    
    return false;
  }
  return true;
  free(requestBuf);
    
}
