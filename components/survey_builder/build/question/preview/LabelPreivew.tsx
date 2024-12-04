const LabelPreivew: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      className="custom-preview"
      dangerouslySetInnerHTML={{ __html: label }}
    ></div>
  );
};

export default LabelPreivew;
