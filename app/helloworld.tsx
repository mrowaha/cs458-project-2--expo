import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button } from "react-native-paper";

export default function HelloWorldScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World!</Text>
      <Link href="/">
        <Button>To Login</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
