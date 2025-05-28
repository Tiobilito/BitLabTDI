import { View, Text, StyleSheet } from 'react-native'
import { scale } from 'react-native-size-matters'

export default ({ status, size = 12 }) => {
  // Get status details based on status value
  const getStatusDetails = (status) => {
    const statusMap = {
      approved: {
        color: '#10B981',
        label: 'Aprobado',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      },
      rejected: {
        color: '#EF4444',
        label: 'Rechazado',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      },
      awaiting_revision: {
        color: '#F59E0B',
        label: 'Esperando revisión',
        backgroundColor: 'rgba(245, 158, 11, 0.1)'
      },
      finished: {
        color: '#FFF',
        label: 'Terminado',
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      },
      default: {
        color: '#6B7280',
        label: 'Desconocido',
        backgroundColor: 'rgba(107, 114, 128, 0.1)'
      }
    }

    return statusMap[status] || statusMap.default
  }

  const statusDetails = getStatusDetails(status)

  return (
    <View style={styles.statusContainer}>
      <View style={[
        styles.statusBadge,
        { backgroundColor: statusDetails.backgroundColor }
      ]}>
        <View style={[
          styles.statusDot,
          { backgroundColor: statusDetails.color }
        ]} />
        <Text style={[
          styles.statusText,
          { color: statusDetails.color, fontSize: scale(size) }
        ]}>
          {statusDetails.label}
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