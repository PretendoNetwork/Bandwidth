import { LogisticRegressionClassifier } from 'natural';
import fs from 'fs-extra';
import cld from 'cld';

const trainingDataDir = `${__dirname}/training-data`;

interface TrainingData {
	intent: string;
	answer: string;
	utterances: string[];
}

interface Classification {
	locale?: string;
	intent?: string;
}

class AIMessageProcessor {
	classifierThreshold: number;
	cldThreshold: number;
	classifiers: Record<string, LogisticRegressionClassifier>;
	answers: Record<string, Record<string, string>>;

	constructor() {
		this.classifierThreshold = 1;
		this.cldThreshold = 100;
		this.classifiers = {};
		this.answers = {};

		// TODO - Add an option to make this save to disk and reuse old training models
		this.train();
	}

	train(): void {
		const locales = fs.readdirSync(trainingDataDir);

		for (const locale of locales) {
			this.classifiers[locale] = new LogisticRegressionClassifier();
			this.answers[locale] = {};

			const trainingFiles = fs.readdirSync(`${trainingDataDir}/${locale}`);

			for (const file of trainingFiles) {
				const trainingData = fs.readJSONSync(`${trainingDataDir}/${locale}/${file}`) as TrainingData;

				this.answers[locale][trainingData.intent] = trainingData.answer;

				for (const utterance of trainingData.utterances) {
					this.classifiers[locale].addDocument(utterance, trainingData.intent);
				}
			}

			this.classifiers[locale].train();
		}
	}

	async classify(text: string): Promise<Classification> {
		let locale: string;

		try {
			const { languages } = await cld.detect(text);
			const language = languages.find(({ percent }) => percent >= this.cldThreshold);
			locale = language!.code;
		} catch {
			return { locale: undefined };
		}

		const classifier = this.classifiers[locale];

		if (!classifier) {
			return { locale };
		}

		const classifications = classifier.getClassifications(text);
		const classification = classifications.find(({ value }) => value >= this.classifierThreshold)?.label;

		return {
			locale,
			intent: classification
		};
	}

	async getResponseOrNothing(message: string): Promise<string | undefined> {
		const { locale, intent } = await this.classify(message);

		if (locale && intent) {
			return this.answers[locale]?.[intent];
		}
	}
}

export default AIMessageProcessor;
