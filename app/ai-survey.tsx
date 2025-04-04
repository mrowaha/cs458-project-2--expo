import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Checkbox,
  RadioButton,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { DateTime } from "luxon";

const aiModels = ["ChatGPT", "Bard", "Claude", "Copilot"] as const;
type AiModel = (typeof aiModels)[number];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Miami",
] as const;
type City = (typeof cities)[number];

const educationLevels = [
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
] as const;
type EducationLevel = (typeof educationLevels)[number];

type SurveyFormData = {
  name: string;
  surname: string;
  birthDate: string;
  education: EducationLevel;
  city: City;
  gender: "male" | "female";
  selectedModels: Array<AiModel>;
  modelCons: Record<AiModel, string>;
  useCase: string;
};

export default function SurveyScreen() {
  const router = useRouter();
  const { control, handleSubmit, watch, setValue } = useForm<SurveyFormData>({
    defaultValues: {
      name: "",
      birthDate: "",
      education: "High School",
      city: "Chicago",
      gender: "male",
      selectedModels: [],
      modelCons: {},
      useCase: "",
    },
  });

  const selectedModels = watch("selectedModels");

  const toggleModel = (model: AiModel) => {
    const current = watch("selectedModels") || [];
    if (current.includes(model)) {
      setValue(
        "selectedModels",
        current.filter((m) => m !== model)
      );
    } else {
      setValue("selectedModels", [...current, model]);
    }
  };

  const onSubmit = (data: SurveyFormData) => {
    console.log("Survey Data:", data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        AI Usage Survey
      </Text>

      <Controller
        control={control}
        name="name"
        rules={{
          required: "Name is required",
          pattern: {
            value: /^[a-zA-Z\s'-]+$/,
            message: "Name contains invalid characters",
          },
        }}
        render={({ field: { onChange, value }, formState }) => (
          <View style={styles.input}>
            <TextInput
              accessibilityLabel="survey-field--fullname"
              label="Full Name"
              value={value}
              onChangeText={onChange}
            />
            {formState.errors.name && (
              <Text accessibilityLabel="survey-error--fullname">
                {formState.errors.name.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        rules={{
          required: "Birth Date is required",
          validate: (value) => {
            const result = DateTime.fromFormat(value, "dd-MM-yyyy").isValid;
            if (!result) {
              return "Not valid";
            }
          },
        }}
        render={({ field: { onChange, value }, formState }) => (
          <View style={styles.input}>
            <TextInput
              accessibilityLabel="survey-field--birthdate"
              label="Birth Date"
              value={value}
              onChangeText={onChange}
            />
            {formState.errors.birthDate && (
              <Text accessibilityLabel="survey-error--birthdate">
                {formState.errors.birthDate.message}
              </Text>
            )}
          </View>
        )}
      />

      <Text style={styles.label}>Education Level</Text>
      <Controller
        control={control}
        name="education"
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            {educationLevels.map((level) => (
              <RadioButton.Item key={level} label={level} value={level} />
            ))}
          </RadioButton.Group>
        )}
      />

      <Text style={styles.label}>City</Text>
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            {cities.map((c) => (
              <RadioButton.Item key={c} label={c} value={c} />
            ))}
          </RadioButton.Group>
        )}
      />

      <Text style={styles.label}>Gender</Text>
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <RadioButton.Item label="Male" value="male" />
            <RadioButton.Item label="Female" value="female" />
          </RadioButton.Group>
        )}
      />

      <Text style={styles.label}>AI Models Tried</Text>
      {aiModels.map((model) => (
        <Checkbox.Item
          key={model}
          label={model}
          status={selectedModels?.includes(model) ? "checked" : "unchecked"}
          onPress={() => toggleModel(model)}
        />
      ))}

      {selectedModels?.map((model) => (
        <Controller
          key={model}
          control={control}
          name={`modelCons.${model}`}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label={`Defects/Cons of ${model}`}
              value={value || ""}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />
      ))}

      <Controller
        control={control}
        name="useCase"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Any beneficial use case of AI in daily life"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      >
        Submit
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
});
