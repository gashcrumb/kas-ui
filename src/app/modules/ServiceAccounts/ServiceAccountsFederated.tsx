import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ServiceAccounts, ServiceAccountsProps } from './ServiceAccounts';
import { RootModal, AlertProvider } from '@app/common';
import kasi18n from '../../../i18n/i18n';

// Federation version of ServiceAccounts

const ServiceAccountsFederated = ({ getConnectToInstancePath }: ServiceAccountsProps) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={kasi18n}>
        <AlertProvider>
          <RootModal>
            <ServiceAccounts getConnectToInstancePath={getConnectToInstancePath} />
          </RootModal>
        </AlertProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default ServiceAccountsFederated;
