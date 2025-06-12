import { useState, Fragment } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import statusMap from '../assets/colors.json'

export default ({ currentStatus, onStatusChange }) => {
    
    const states = ["approved", "in_process", "finished", "delivered"]

    const getStatusIndex = () => states.indexOf(currentStatus)
    const getStatusDetails = () => statusMap[currentStatus] || statusMap.default
    const statusDetails = getStatusDetails()

    const handlePress = (state) => {
        if (state !== currentStatus)
          onStatusChange(state)
    }

    // useEffect(() => {
    //     console.log("Current -> ", currentStatus)
    //     console.log("Status -> ", status)
    // }, [])
    
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          {states.map((state, index) => {
            const isActive = currentStatus === state
            const isCompleted = index <= getStatusIndex()

            return (
              <Fragment key={state}>
                <TouchableOpacity
                  onPress={() => handlePress(state)}
                  style={[
                    styles.circle,
                    isCompleted && styles.circleCompleted,
                    isActive && styles.circleActive,
                  ]}
                >
                  <Text style={styles.circleText}>{index + 1}</Text>
                </TouchableOpacity>
                { index < states.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      index < getStatusIndex() && styles.lineCompleted,
                    ]}
                  />
                )}
              </Fragment>
            )
          })}
        </View>
        <Text style={[
          styles.statusText,
          { color: (statusDetails.es === "Entregado") && "#28A745" },
        ]}>{statusDetails.es}</Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  circleCompleted: {
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    borderWidth: 0,
  },
  circleActive: {
    borderColor: "#28A745",
    backgroundColor: "#28A745",
    borderWidth: 0,
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  line: {
    width: 40,
    height: 3,
    backgroundColor: "#ccc",
  },
  lineCompleted: {
    backgroundColor: "#007BFF",
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
})