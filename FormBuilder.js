import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from 'axios'

const FormBuilderScreen = () => {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const handleImageUpload = useCallback(() => {
    try {
      // Use image picker to select an image from the device
      const options = {
        mediaType: 'photo',
        includeBase64: false,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          setError(response.error);
        } else {
          const selectedImage = response.assets[0].uri; // Get the selected image URI
          setHeaderImage(selectedImage);
        }
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const addQuestion = useCallback((type) => {
    try {
      const newQuestion = {
        id: Date.now(), // Unique identifier
        type,
        title: "",
        description: "",
        required: false,
        image: null,
        options: type === "Grid" ? [""] : [],
        gridRows: type === "Grid" ? [""] : [],
        gridColumns: type === "Grid" ? [""] : [],
        checkBoxes: type === "CheckBox" ? [""] : [], // Added for CheckBox question type
      };
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const updateQuestion = useCallback((id, field, value) => {
    try {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === id ? { ...question, [field]: value } : question
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const removeQuestion = useCallback((id) => {
    try {
      setQuestions((prevQuestions) => prevQuestions.filter(question => question.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const createForm = useCallback(async () => {
    try {
      // Basic validation
      if (!formTitle.trim()) {
        setError("Form title is required");
        return;
      }

      const formData = {
        title: formTitle,
        description: formDescription,
        headerImage,
        questions,
      };


      const response = await axios.post("http://10.0.2.2:3000/api/forms/create", JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status!=200) {
        const errorText = await response.text();
        console.error(`Error: ${response.status} ${errorText}`);
        throw new Error(`Form creation failed: ${response.status} ${errorText}`);
      }
      // Reset form after successful creation
      setFormTitle("");
      setFormDescription("");
      setHeaderImage(null);
      setQuestions([]);
    } catch (err) {
      setError(err.message);
      console.error("Form creation error:", err);
    }
  }, [formTitle, formDescription, headerImage, questions]);

  // Error display component
  const ErrorDisplay = error ? (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={() => setError(null)}>
        <Text style={styles.errorDismiss}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {ErrorDisplay}

      <Text style={styles.title}>Create Form</Text>

      {/* Form Title */}
      <TextInput
        style={styles.input}
        placeholder="Form Title"
        value={formTitle}
        onChangeText={setFormTitle}
      />

      {/* Form Description */}
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Form Description"
        value={formDescription}
        onChangeText={setFormDescription}
        multiline
      />

      {/* Header Image Upload */}
      <TouchableOpacity
        style={styles.imageUploadButton}
        onPress={handleImageUpload}
      >
        <Text style={styles.imageUploadText}>Add Header Image</Text>
      </TouchableOpacity>

      {headerImage && (
        <Image source={{ uri: headerImage }} style={styles.headerImage} />
      )}

      {/* Question Type Buttons */}
      <View style={styles.questionTypeContainer}>
        {["Text", "Grid", "CheckBox"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.questionTypeButton,
              {
                backgroundColor:
                  type === "Text"
                    ? "#10B981"
                    : type === "Grid"
                    ? "#8B5CF6"
                    : "#F97316",
              },
            ]}
            onPress={() => addQuestion(type)}
          >
            <Text style={styles.questionTypeButtonText}>{type} Question</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Questions List */}
      {questions.map((question) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionTypeText}>{question.type} Question</Text>

          <TextInput
            style={styles.input}
            placeholder="Question Title"
            value={question.title}
            onChangeText={(text) => updateQuestion(question.id, "title", text)}
          />

          {/* Grid-specific inputs */}
          {question.type === "Grid" && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Add Grid Row"
                onChangeText={(text) => {
                  const rows = [...(question.gridRows || []), text];
                  updateQuestion(question.id, "gridRows", rows);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Add Grid Column"
                onChangeText={(text) => {
                  const columns = [...(question.gridColumns || []), text];
                  updateQuestion(question.id, "gridColumns", columns);
                }}
              />
            </View>
          )}

          {/* CheckBox-specific inputs */}
          {question.type === "CheckBox" && (
            <View>
              {question.checkBoxes.map((checkBox, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder={`Add CheckBox Option ${index + 1}`}
                  onChangeText={(text) => {
                    const checkBoxes = [...question.checkBoxes];
                    checkBoxes[index] = text;
                    updateQuestion(question.id, "checkBoxes", checkBoxes);
                  }}
                />
              ))}
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={() => {
                  const checkBoxes = [...question.checkBoxes, ""];
                  updateQuestion(question.id, "checkBoxes", checkBoxes);
                }}
              >
                <Text style={styles.addOptionButtonText}>Add Option</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Close button to remove question */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => removeQuestion(question.id)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Create Form Button */}
      <TouchableOpacity style={styles.createButton} onPress={() => {
        Alert.alert(
          "",
          "Are you sure you want to save the form?",
          [
            { text: "Cancel", onPress: () => {}, style: "cancel" },
            { text: "Save", onPress: createForm },
          ],
          { cancelable: true }
        );
      }}>
        <Text style={styles.createButtonText}>Create Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#991B1B",
    flex: 1,
    marginRight: 10,
  },
  errorDismiss: {
    color: "#7F1D1D",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  multilineInput: {
    height: 100,
  },
  imageUploadButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  imageUploadText: {
    color: "white",
    fontWeight: "bold",
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  questionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  questionTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  questionTypeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  questionContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  questionTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 8,
    right: 8,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addOptionButton: {
    backgroundColor: "#10B981",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addOptionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormBuilderScreen;