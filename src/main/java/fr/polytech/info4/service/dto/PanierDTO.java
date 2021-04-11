package fr.polytech.info4.service.dto;

import fr.polytech.info4.domain.enumeration.SystemPaiment;
import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link fr.polytech.info4.domain.Panier} entity.
 */
public class PanierDTO implements Serializable {

    private Long id;

    private SystemPaiment method;

    @DecimalMin(value = "0")
    private Float price;

    @NotNull
    private Boolean isPaid;

    private CourseDTO course;

    private CompteDTO compte;

    private RestaurantDTO restaurant;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SystemPaiment getMethod() {
        return method;
    }

    public void setMethod(SystemPaiment method) {
        this.method = method;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Boolean getIsPaid() {
        return isPaid;
    }

    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public CompteDTO getCompte() {
        return compte;
    }

    public void setCompte(CompteDTO compte) {
        this.compte = compte;
    }

    public RestaurantDTO getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(RestaurantDTO restaurant) {
        this.restaurant = restaurant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PanierDTO)) {
            return false;
        }

        PanierDTO panierDTO = (PanierDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, panierDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PanierDTO{" +
            "id=" + getId() +
            ", method='" + getMethod() + "'" +
            ", price=" + getPrice() +
            ", isPaid='" + getIsPaid() + "'" +
            ", course=" + getCourse() +
            ", compte=" + getCompte() +
            ", restaurant=" + getRestaurant() +
            "}";
    }
}
