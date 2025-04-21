export interface ConfigurableField {
  id: string;
  label: string;
  type?: 'default' | 'custom';
}

export interface TableConfigurationProps {
  onClose: () => void;
}