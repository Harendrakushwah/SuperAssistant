import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import getEnvVars from '../config';
const { apiUrl } = getEnvVars();

const TaskList = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchTasks().then(() => {
      setIsLoading(false);
    });
  }, [navigation]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getTasks`);
      if (response?.data?.success) {
        const currentDate = new Date();
        // Set current date to start of day (midnight)
        currentDate.setHours(0, 0, 0, 0);
        const activeTasks = response?.data?.Data.filter(task => {
          const taskDeadline = new Date(task.deadline);
          taskDeadline?.setHours(0, 0, 0, 0);
          return taskDeadline >= currentDate;
        });
        setTasks(activeTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

  const handleCompleteTask = async taskId => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/completeTask/${taskId}`,
      );
      if (response?.data?.success) {
        fetchTasks(); // Refetch tasks to update the UI
      }
    } catch (error) {
      console.error(`Error completing task ${taskId}: `, error);
    }
  };

  const handleDeleteTask = async taskId => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/deleteTask/${taskId}`,
      );
      if (response?.status == 204) {
        fetchTasks(); // Refetch tasks to update the UI
      }
    } catch (error) {
      console.error(`Error deleting task ${taskId}: `, error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Tasks</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add Task')}>
        <Text style={styles.addButtonText}>+ Add New Task</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTaskCard = ({item}) => (
    <View style={[styles.taskCard, item.completed && styles.completedCard]}>
      <View style={styles.taskHeader}>
        <Text style={[styles.statusBadge, { color: item.completed ? '#28a745' : '#CCAC00' }]}>
          {item.completed ? 'Completed' : 'Pending'}
        </Text>
      </View>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDesc}>{item.description}</Text>

      <View style={styles.taskFooter}>
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineLabel}>Due:</Text>
          <Text style={styles.deadlineText}>
            {new Date(item.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {!item.completed && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompleteTask(item?._id)}>
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTask(item?._id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      {!isLoading ? (
        tasks?.length ? (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={tasks}
            keyExtractor={item => item?._id?.toString()}
            renderItem={renderTaskCard}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks available</Text>
            <Text style={styles.emptySubText}>Add a new task to get started!</Text>
          </View>
        )
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
};

export default TaskList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.8,
    backgroundColor: '#f8f9fa',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  taskDesc: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 4,
  },
  deadlineText: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  completeButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#adb5bd',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
