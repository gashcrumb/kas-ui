import * as React from 'react';
import { EmptyState } from './EmptyState';
import i18n from '../../../i18n/i18n';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

jest.mock('react-i18next', () => {
  const reactI18next = jest.requireActual('react-i18next');
  return {
    ...reactI18next,
    useTranslation: () => ({ t: (key) => key, i18n: { changeLanguage: jest.fn() } }),
  };
});

describe('Empty State Test', () => {
  test('should render empty state component', () => {
    const { getByTestId, getByText } = render(
      <EmptyState createStreamsInstance={false} setCreateStreamsInstance={jest.fn()} mainToggle={false} />
    );
    expect(getByText('you_do_not_have_any_kafka_instances_yet')).toBeDefined();
    expect(getByText('create_a_kafka_instance')).toBeDefined();
    expect(getByText('create_a_kafka_instance_to_get_started')).toBeDefined();
    expect(getByTestId('empty-state-icon')).toBeDefined();
    expect(getByTestId('empty-state-title')).toBeDefined();
    expect(getByTestId('create-kafka-btn')).toBeDefined();
  });

  test('should allow user to create instance', () => {
    const onCreate = jest.fn();
    const { getByTestId } = render(
      <EmptyState createStreamsInstance={false} setCreateStreamsInstance={onCreate} mainToggle={false} />
    );

    const item = getByTestId('create-kafka-btn');
    fireEvent.click(item);
    expect(onCreate).toHaveBeenCalled();
  });
});
