const LabelPreivew: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      className="custom-preview w-min"
      dangerouslySetInnerHTML={{ __html: label }}
    ></div>
  );
};

export default LabelPreivew;
