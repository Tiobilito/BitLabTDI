import { View, Text, StyleSheet } from 'react-native'
import { scale } from 'react-native-size-matters'
import statusMap from '../assets/colors.json';

export default ({ status, size = 12 }) => {
  // Get status details based on status value
  const getStatusDetails = (status) => statusMap[status] || statusMap.default

  const statusDetails = getStatusDetails(status)

  return (
    <View style={styles.statusContainer}>
      <View style={[
        styles.statusBadge,
        { backgroundColor: statusDetails.background }
      ]}>
        <View style={[
          styles.statusDot,
          { backgroundColor: statusDetails.color }
        ]} />
        <Text style={[
          styles.statusText,
          { color: statusDetails.color, fontSize: scale(size) }
        ]}>
          {statusDetails.es}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontWeight: '600',
  }
})