---
title: 'Embedded Systems & Pulse Oximetry'
description: 'How Embedded Systems Process Oxygen Saturation Data in Real-Time'
pubDate: 'Aug 20 2024'
tags:
  - Embedded systems
  - Medtech
---

## Introduction

**Pulse oximetry** is an efficient way to monitor oxygen saturation (*SpO2*) in the blood. The role of embedded technology here is to process signals in real time to provide accurate **SpO2** readings. The pulse oximeter uses principles of light absorption to determine oxygen levels, and the system is responsible for managing sensors, processing data, and calculating the oxygen saturation.

![screenshot of pulse oximeter](https://res.cloudinary.com/diekemzs9/image/upload/v1731875887/pulse_m_oylpdu.jpg)


## Components

- Light Source (LEDs):

These LEDs shine light through the tissue, and the amount of light absorbed depends on the oxygenation levels of the hemoglobin in the blood.

- Photodetector:

A photodetector measures the amount of light that is absorbed by the blood.
The amount of light absorbed by the blood is inversely proportional to the amount of oxygenated hemoglobin. The photodetector sends this data to the microcontroller.

- Microcontroller:

The microcontroller processes the signals from the photodetector to calculate the absorption ratios of red and infrared light. This ratio is crucial in determining the *SpO2* level.

* The core of the microcontroller's task is to apply **Beer-Lambert's** Law and convert the measured absorption into a meaningful oxygen saturation value. The absorption of red and infrared light is calculated and compared as:

![screenshot of lambert law](https://res.cloudinary.com/diekemzs9/image/upload/v1731875912/lamb_law_ygsan0.png)

*This ratio is processed by the microcontroller, which then calculates the SpO2 and displays it to the user.*

## Application

Let’s assume the measured absorbance at red light (660 nm) is *A red* = 0.4 &  at infrared light (940 nm) *A infrared* = 0.2
​The system will calculate it as :

![screenshot of solution](https://res.cloudinary.com/diekemzs9/image/upload/v1731875923/infra_bl0lhw.png)

This result means 50% of the hemoglobin in the blood is oxygenated

*Oxygen saturation of **50%** is significantly lower than the normal range (**95-100%**). 
This suggests that the body is not receiving enough oxygen, which could indicate a serious condition such as respiratory failure or severe hypoxemia.*

## Error Sources

These are some factors can lead to errors in the system:

- **Carboxyhemoglobin/methemoglobin** absorb light similarly to oxyhemoglobin, leading to overestimation of oxygen saturation.
The embedded system needs to be calibrated to account for this.

- **Motion** can cause signal distortion. The embedded system filters these out using motion-detection algorithms, ensuring accurate readings even during patient movement.

---

*citation*:

*Upadhyay, A., & Dhapola, A. S. (2015). Embedded systems and its application in medical field. [https://doi.org/10.13140/2.1.1299.1528] *

