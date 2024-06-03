import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  base: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#e0e0e0",
    backgroundColor: "#f0f0f0",
    borderWidth: 1
  },
  devices: {
    
  },
  h1: {
    fontSize: 18,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 15,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 13,
    fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 2,
    // paddingHorizontal: 5
  },
  networkSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5
  },
  smallIcon: {
    width: 18,
    height: 18,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 5,
    gap: 4
  },
  input: {
    backgroundColor: "#fefefe",
    borderColor: "#aeaeae",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    height: 32,
    color: 'black',
  },
  btn: {
    backgroundColor: "#fefefe",
    borderColor: "#aeaeae",
    borderWidth: 1,
    padding: 5,
    height: 32,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    fontWeight: 600,
    color: "black"
  },
  formRow: {
    width: "100%",
    flexDirection: "row",
    gap: 5
  },
  form: {
    flexDirection: "column",
    gap: 5
  },
  maskInput: {
    width: 50
  },
  ipInput: {
    flexGrow: 1
  }
});

export default styles;
