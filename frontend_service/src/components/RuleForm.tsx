import { FC, useState, useEffect } from 'react';
import axios from 'axios';

interface RuleFormProps {
  onRuleAdded: () => void;
  email: string;
}

const RuleForm: FC<RuleFormProps> = ({ onRuleAdded, email }) => {
  const [formData, setFormData] = useState({
    email,
    baseCurrency: '',
    targetCurrency: '',
    type: 'INCREASE',
    percentage: 0,
    isActive: true,
  });

  const [currencies, setCurrencies] = useState<string[]>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:6969/currencies');
        setCurrencies(response.data);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;

    if (target.type === 'checkbox') {
      const { name, checked } = target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      const { name, value } = target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        percentage: parseFloat(formData.percentage.toString()),
      };
      await axios.post('http://localhost:6969/rules', dataToSend);
      setFormData({
        ...formData,
        baseCurrency: '',
        targetCurrency: '',
        percentage: 0,
      });
      onRuleAdded();
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Rule</h2>
      <label>
        Base Currency:
        <select
          name="baseCurrency"
          value={formData.baseCurrency}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Base Currency
          </option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </label>
      <label>
        Target Currency:
        <select
          name="targetCurrency"
          value={formData.targetCurrency}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Target Currency
          </option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </label>
      <label>
        Rule Type:
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="INCREASE">INCREASE</option>
          <option value="DECREASE">DECREASE</option>
        </select>
      </label>
      <label>
        Percentage:
        <input
          type="number"
          name="percentage"
          value={formData.percentage}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Active:
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Add Rule</button>
    </form>
  );
};

export default RuleForm;
