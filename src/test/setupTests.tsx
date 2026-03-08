import "@testing-library/jest-dom";

// Mock components

jest.mock("@/components/button/button", () => ({
  Button: ({ label, onClick }: any) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

jest.mock("@/components/search/search", () => ({
  Search: ({ onValueChange }: any) => (
    <input
      aria-label="search"
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/filter/filter", () => ({
  Filter: ({ onChange }: any) => (
    <button onClick={() => onChange("changed")}>filter</button>
  ),
}));

/* eslint-disable react/display-name */
jest.mock("@/components/modal/modal", () => {
  const Modal = ({ children }: any) => <div>{children}</div>;

  Modal.Header = ({ children }: any) => <div>{children}</div>;
  Modal.Body = ({ children }: any) => <div>{children}</div>;
  Modal.Footer = ({ children }: any) => <div>{children}</div>;

  return { Modal };
});

jest.mock("@/components/form/input", () => {
  const React = require("react");

  const Input = React.forwardRef(
    ({ label, value, onChange, type = "text", error }: any, ref: any) => (
      <div>
        <label>{label}</label>
        <input
          ref={ref}
          aria-label={label}
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {error && <span>{error}</span>}
      </div>
    )
  );

  Input.displayName = "Input";

  return { Input };
});

jest.mock("@/components/form/select", () => {
  const React = require("react");

  const Select = React.forwardRef(
    ({ label, value, options, onChange }: any, ref: any) => (
      <div>
        <label>{label}</label>
        <select
          ref={ref}
          aria-label={label}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map((o: any) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    )
  );

  Select.displayName = "Select";

  return { Select };
});

jest.mock("@/components/form/checkbox", () => {
  const React = require("react");

  const Checkbox = React.forwardRef(
    ({ label, checked, onChange }: any, ref: any) => (
      <label>
        {label}
        <input
          ref={ref}
          aria-label={label}
          type="checkbox"
          checked={checked || false}
          onChange={(e) => onChange(e.target.checked)}
        />
      </label>
    )
  );

  Checkbox.displayName = "Checkbox";

  return { Checkbox };
});

jest.mock("@/components/form/textarea", () => {
  const React = require("react");

  const Textarea = React.forwardRef(
    ({ label, value, onChange }: any, ref: any) => (
      <div>
        <label>{label}</label>
        <textarea
          ref={ref}
          aria-label={label}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  );

  Textarea.displayName = "Textarea";

  return { Textarea };
});

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, onClick }: any) => (
    <span data-testid={`icon-${icon?.iconName}`} onClick={onClick} />
  ),
}));

jest.mock("@/components/table/table", () => ({
  Table: ({ data, columns, rowKey }: any) => (
    <div>
      {data.map((row: any) => (
        <div key={rowKey(row)} data-testid={`row-${rowKey(row)}`}>
          {columns.map((col: any) => (
            <span key={col.key}>
              {col.render ? col.render(row) : row[col.accessor]}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/pagination/pagination", () => ({
  Pagination: ({ onPageChange }: any) => (
    <button onClick={() => onPageChange(2)}>next-page</button>
  ),
}));

jest.mock("@/components/tooltip/tooltip", () => ({
  Tooltip: ({ children }: any) => <span>{children}</span>,
}));
