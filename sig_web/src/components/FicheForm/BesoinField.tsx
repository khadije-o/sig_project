// import React from 'react';
// import { Designation } from '../../hooks/useDesignations';

// interface BesoinFieldProps {
//   index: number;
//   besoin: {
//     quantité: number;
//     designation: number;
//     observation: string;
//   };
//   designations: Designation[];
//   onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   onRemove: (index: number) => void;
//   showRemove: boolean;
// }

// const BesoinField: React.FC<BesoinFieldProps> = ({
//   index,
//   besoin,
//   designations,
//   onChange,
//   onRemove,
//   showRemove,
// }) => (
//   <div className="besoin-group">
//     <div className="form-group">
//       <label>Désignation:</label>
//       <select
//         name="designation"
//         value={besoin.designation}
//         onChange={(e) => onChange(index, e)}
//         required
//       >
//         <option value="">-- Choisir --</option>
//         {designations.map((item) => (
//           <option key={item.id} value={item.id}>
//             {item.nom}
//           </option>
//         ))}
//       </select>
//     </div>

//     <div className="form-group">
//       <label>Quantité:</label>
//       <input
//         type="number"
//         name="quantité"
//         min="1"
//         value={besoin.quantité}
//         onChange={(e) => onChange(index, e)}
//         required
//       />
//     </div>

//     <div className="form-group">
//       <label>Observation:</label>
//       <input
//         type="text"
//         name="observation"
//         value={besoin.observation}
//         onChange={(e) => onChange(index, e)}
//       />
//     </div>

//     {showRemove && (
//       <button
//         type="button"
//         className="remove-btn"
//         onClick={() => onRemove(index)}
//         title="Supprimer ce besoin"
//       >
//         <i className="fas fa-times"></i>
//       </button>
//     )}
//   </div>
// );

// export default BesoinField;

import React from 'react';
import { Designation } from '../../hooks/useDesignations';
import InputField from '../Forms/InputField';
import Button from '../button/button';

interface BesoinFieldProps {
  index: number;
  besoin: {
    quantité: number;
    designation: number;
    observation: string;
  };
  designations: Designation[];
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

const BesoinField: React.FC<BesoinFieldProps> = ({
  index,
  besoin,
  designations,
  onChange,
  onRemove,
  showRemove,
}) => (
  <div className="besoin-group">
    <div className="form-group">
      <label>Désignation:</label>
      <select
        name="designation"
        value={besoin.designation}
        onChange={(e) => onChange(index, e)}
        required
      >
        <option value="">-- Choisir --</option>
        {designations.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nom}
          </option>
        ))}
      </select>
    </div>

    <InputField
      label="Quantité:"
      type="number"
      name="quantité"
      min={1}
      value={besoin.quantité}
      onChange={(e) => onChange(index, e)}
      required
    />

    <InputField
      label="Observation:"
      type="text"
      name="observation"
      value={besoin.observation}
      onChange={(e) => onChange(index, e)}
    />

    {showRemove && (
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={() => onRemove(index)}
        title="Supprimer ce besoin"
        className='remove-btn'
      >
        <i className="fas fa-times"></i>
      </Button>
    )}
  </div>
);

export default BesoinField;

