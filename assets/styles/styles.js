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
    padding: 5,
    borderRadius: 5,
    borderColor: "#fefefe",
    backgroundColor: "#efefef",
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
  networkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
    paddingVertical: 2,
    paddingHorizontal: 5,
    // padding: 10,
  },
  networkSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    padding: 5,  //TODO
    gap: 4
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderColor: "#fefefe",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    // flex: 1,
    height: 32
  },
  btn: {
    backgroundColor: "#f1f1f1",
    borderColor: "#fefefe",
    borderWidth: 1,
    padding: 5,
    height: 32,
    display: "flex",
    
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    aspectRatio: 1,
    borderRadius: 4,
    elevation: 3,
    fontWeight: 600
    // backgroundColor: 'black',
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
