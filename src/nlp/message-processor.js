const natural = require('natural');
const fs = require('fs-extra');
const cld = require('cld');

const trainingDataDir = `${__dirname}/training-data`;

class AIMessageProcessor {
	constructor() {
		this.classifierThreshold = 1;
		this.cldThreshold = 100;
		this.classifiers = {};
		this.answers = {};

		// TODO - Add an option to make this save to disk and reuse old training models
		this.train();
	}

	train() {
		const locales = fs.readdirSync(trainingDataDir);

		for (const locale of locales) {
			this.classifiers[locale] = new natural.LogisticRegressionClassifier();
			this.answers[locale] = {};

			const trainingFiles = fs.readdirSync(`${trainingDataDir}/${locale}`);

			for (const file of trainingFiles) {
				const trainingData = fs.readJSONSync(`${trainingDataDir}/${locale}/${file}`);

				this.answers[locale][trainingData.intent] = trainingData.answer;

				for (const utterance of trainingData.utterances) {
					this.classifiers[locale].addDocument(utterance, trainingData.intent);
				}
			}

			this.classifiers[locale].train();
		}
	}

	async classify(text) {
		let locale;

		try {
			const { languages } = await cld.detect(text);
			const language = languages.find(({ percent }) => percent >= this.cldThreshold);
			locale = language?.code;
		} catch {
			return { locale };
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

	async getResponseOrNothing(message) {
		const { locale, intent } = await this.classify(message);

		if (intent) {
			return this.answers[locale]?.[intent];
		}
	}
}

module.exports = AIMessageProcessor;