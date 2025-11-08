/**
 * QuestionView Component
 * Displays a question with appropriate input based on type (MCQ, fill-blank, short-answer)
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Question } from '../types';
import { useColors, Spacing, Typography, Radius } from '../theme';
import { AnswerButton } from './AnswerButton';

interface QuestionViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer?: string | number;
  showFeedback?: boolean;
  onAnswerSelect: (answer: string | number) => void;
  disabled?: boolean;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  showFeedback = false,
  onAnswerSelect,
  disabled = false
}) => {
  const colors = useColors();
  const [textAnswer, setTextAnswer] = useState('');

  const handleTextChange = (text: string) => {
    setTextAnswer(text);
    onAnswerSelect(text);
  };

  const getOptionState = (index: number) => {
    if (!showFeedback) {
      return userAnswer === index ? 'selected' : 'default';
    }

    if (index === question.correctIndex) {
      return 'correct';
    }
    if (userAnswer === index) {
      return 'incorrect';
    }
    return 'default';
  };

  return (
    <View style={styles.container}>
      {/* Question Header */}
      <View style={styles.header}>
        <Text style={[styles.questionNumber, { color: colors.textSecondary }]}>
          Question {questionNumber} of {totalQuestions}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.typeText, { color: colors.primary }]}>
            {question.type === 'mcq' ? 'Multiple Choice' :
             question.type === 'fillBlank' ? 'Fill in Blank' : 'Short Answer'}
          </Text>
        </View>
      </View>

      {/* Question Text */}
      <Text style={[styles.questionText, { color: colors.textPrimary }]}>
        {question.question}
      </Text>

      {/* Answer Input */}
      <View style={styles.answerContainer}>
        {question.type === 'mcq' && question.options ? (
          // MCQ Options
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <AnswerButton
                key={index}
                label={`${['A', 'B', 'C', 'D'][index]}. ${option}`}
                onPress={() => onAnswerSelect(index)}
                state={getOptionState(index)}
                disabled={disabled}
              />
            ))}
          </View>
        ) : (
          // Text Input for fill-blank and short-answer
          <View>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                  color: colors.textPrimary
                }
              ]}
              placeholder="Type your answer..."
              placeholderTextColor={colors.textTertiary}
              value={textAnswer}
              onChangeText={handleTextChange}
              editable={!disabled}
              multiline={question.type === 'shortAnswer'}
              numberOfLines={question.type === 'shortAnswer' ? 4 : 1}
              autoCapitalize="sentences"
              autoCorrect={false}
            />

            {/* Show correct answer in feedback mode */}
            {showFeedback && (
              <View style={[styles.correctAnswerBox, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.correctAnswerLabel, { color: colors.success }]}>
                  Correct Answer:
                </Text>
                <Text style={[styles.correctAnswerText, { color: colors.textPrimary }]}>
                  {question.correctAnswer}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Explanation (shown in feedback mode) */}
      {showFeedback && question.explanation && (
        <View style={[styles.explanationBox, { backgroundColor: colors.secondaryBackground }]}>
          <Text style={[styles.explanationLabel, { color: colors.textSecondary }]}>
            Explanation
          </Text>
          <Text style={[styles.explanationText, { color: colors.textPrimary }]}>
            {question.explanation}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium
  },
  questionNumber: {
    ...Typography.callout,
    fontWeight: '600'
  },
  typeBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: Radius.pill
  },
  typeText: {
    ...Typography.caption1,
    fontWeight: '600'
  },
  questionText: {
    ...Typography.title2,
    marginBottom: Spacing.large
  },
  answerContainer: {
    flex: 1
  },
  optionsContainer: {
    gap: Spacing.medium
  },
  textInput: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: Radius.input,
    padding: Spacing.medium,
    minHeight: 56,
    textAlignVertical: 'top'
  },
  correctAnswerBox: {
    marginTop: Spacing.medium,
    padding: Spacing.medium,
    borderRadius: Radius.card
  },
  correctAnswerLabel: {
    ...Typography.caption1,
    fontWeight: '600',
    marginBottom: Spacing.tiny
  },
  correctAnswerText: {
    ...Typography.body,
    fontWeight: '600'
  },
  explanationBox: {
    marginTop: Spacing.large,
    padding: Spacing.medium,
    borderRadius: Radius.card
  },
  explanationLabel: {
    ...Typography.caption1,
    fontWeight: '600',
    marginBottom: Spacing.tiny
  },
  explanationText: {
    ...Typography.body
  }
});
