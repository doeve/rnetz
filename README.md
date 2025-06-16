# **NETZ: Mobile Network Scanning, Management, and Configuration Appliance**

## **Introduction**

NETZ is a mobile network scanning, management, and configuration appliance designed to streamline the monitoring and optimization of mobile networks. It is developed by Şerb David-Mihai at The Polytechnic University of Timisoara, Faculty of Electronics, Telecommunications and Information Technology (2023-2024), under the scientific coordination of Dr. Ing. Stolojescu-Crişan Cristina-Laura and Savnet coordination of Dr. Ing. Adrian Savu-Jivanov.

This tool is targeted towards telecommunication experts, network administrators, and amateurs alike, or anybody who has an interest in this field. It aims to eliminate guesswork from network management by providing comprehensive configuration and monitoring capabilities for network devices.

## **How It Works**

NETZ is built using Meta's **React Native** framework. It leverages **npm** for dependency management and incorporates many functionalities implemented using native **Java**. Device configuration is primarily handled through the **SSH protocol**.

## **Key Functionalities**

NETZ offers a robust set of features to manage and monitor your network:

* **Parallel Network Discovery:** Efficiently scans both local and external networks if accessible.
* **Device Connection:** Connects to various networking devices.
* **Interface Listing:** Displays interfaces of connected devices along with their IP addresses and current status.
* **Network Map:** Provides a visual representation (map) of connected devices.
* **Configuration Export:** Allows exporting device configurations.

### **Scanning Capabilities**

NETZ provides powerful scanning features:

* Automatically detects local network addresses and appropriate masks.
* Scans local or external networks rapidly.
* Detects all devices supporting ICMP by parallelly pinging the entire network.

<p align="center">
  <img src="https://i.ibb.co/mC5hnqQv/discovered-devices.png" alt="Discovered Devices Screen" width="300">
  <br>
  Fig. 1 - Discovered Devices Screen
</p>

### **Interfaces, Network Map & Configuration Management**

Gain insights into your network interfaces, visualize your network, and manage configurations:

* **Interfaces:** States the IP address and current status of each interface.
* **Network Map:** States the type of rule, IP address, and interface name of a route.
* **Configuration:** Offers functionalities to start and export configurations.

<p align="center">
  <img src="https://i.ibb.co/LX7qVrd0/overlaid.png" alt="Different Functionalities Overlaid" width="300">
  <br>
  Fig. 2 - Different Functionalities Overlaid
</p>

### **The Console**

Access the raw output and send arbitrary commands directly to connected devices.

* Can be accessed from the device screen.
* Displays raw returned data.
* Allows reading and sending arbitrary commands to the connected device.

<p align="center">
  <img src="https://i.ibb.co/XfGW39Tx/raw-output.png" alt="Showcasing Raw Output of Console" width="300">
  <br>
  Fig. 3 - Showcasing Raw Output of Console
</p>

## **Testing**

The devices were tested on a virtual network created in GNS3. The cloud node connected to the local network interface, integrating its devices into the setup. A simple topology was implemented to focus on connection and command functionality.

## **Further Development & Conclusion**

Future enhancements planned for NETZ include:

* Automatically detecting local network addresses and appropriate masks.
* Scanning local or external networks rapidly when available.
* Detecting all devices which support ICMP by parallelly pinging the entire network.

NETZ aims to be a comprehensive and intuitive tool for network professionals and enthusiasts, simplifying complex network management tasks.
